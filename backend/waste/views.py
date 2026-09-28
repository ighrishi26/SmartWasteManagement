import pandas as pd

from django.http import HttpResponse
from django.db.models import Q
from .services.analytics_service import get_complete_analytics
from django.db import connection

from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.response import Response

from .models import WasteRecord
from .serializers import WasteRecordSerializer
from .ml.preprocessing import get_dataset_summary
from .ml.train_models import train_all_models
from .ml.model_utils import load_metrics, load_best_model
from .ml.prediction import predict_waste
from .ml.anomaly_detection import detect_anomalies
from waste.services.collection_service import get_collection_plan
from waste.services.recommendation_service import get_recommendations
from waste.services.report_service import export_waste_report
from accounts.permissions import get_user_role


from .services.csv_service import (
    clean_csv_dataframe,
    import_dataframe,
)


class WasteRecordViewSet(viewsets.ModelViewSet):
    serializer_class = WasteRecordSerializer
    
    def require_roles(self, allowed_roles):
        role = get_user_role(self.request.user)

        if role not in allowed_roles:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "You do not have permission to perform this action."
            )

    def get_queryset(self):
        queryset = WasteRecord.objects.all()

        search = self.request.query_params.get(
            "search"
        )
        location = self.request.query_params.get(
            "location"
        )
        waste_type = self.request.query_params.get(
            "waste_type"
        )
        holiday = self.request.query_params.get(
            "holiday"
        )
        special_event = self.request.query_params.get(
            "special_event"
        )
        date_from = self.request.query_params.get(
            "date_from"
        )
        date_to = self.request.query_params.get(
            "date_to"
        )

        if search:
            queryset = queryset.filter(
                Q(location__icontains=search)
                | Q(waste_type__icontains=search)
            )

        if location:
            queryset = queryset.filter(
                location__iexact=location
            )

        if waste_type:
            queryset = queryset.filter(
                waste_type__iexact=waste_type
            )

        if holiday in ["true", "false"]:
            queryset = queryset.filter(
                holiday=holiday == "true"
            )

        if special_event in ["true", "false"]:
            queryset = queryset.filter(
                special_event=special_event == "true"
            )

        if date_from:
            queryset = queryset.filter(
                date__gte=date_from
            )

        if date_to:
            queryset = queryset.filter(
                date__lte=date_to
            )

        return queryset.order_by(
            "-date",
            "-created_at",
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        self.perform_create(serializer)

        return Response(
            {
                "message": (
                    "Waste record created successfully."
                ),
                "record": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    def update(
        self,
        request,
        *args,
        **kwargs,
    ):
        partial = kwargs.pop(
            "partial",
            False,
        )

        instance = self.get_object()

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial,
        )

        serializer.is_valid(
            raise_exception=True
        )

        self.perform_update(serializer)

        return Response(
            {
                "message": (
                    "Waste record updated successfully."
                ),
                "record": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def destroy(
        self,
        request,
        *args,
        **kwargs,
    ):
        instance = self.get_object()

        self.perform_destroy(instance)

        return Response(
            {
                "message": (
                    "Waste record deleted successfully."
                )
            },
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["post"],
        url_path="import-csv",
    )
    def import_csv(self, request):
        self.require_roles(
            ["Administrator", "Operator"]
        )
                
        uploaded_file = request.FILES.get(
            "file"
        )

        if not uploaded_file:
            return Response(
                {
                    "error": (
                        "Please upload a CSV file."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not uploaded_file.name.lower().endswith(
            ".csv"
        ):
            return Response(
                {
                    "error": (
                        "Only CSV files are supported."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            dataframe = pd.read_csv(
                uploaded_file
            )
        except Exception as error:
            return Response(
                {
                    "error": (
                        f"Unable to read CSV file: {error}"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        result = clean_csv_dataframe(
            dataframe
        )

        if not result["success"]:
            return Response(
                {
                    "error": result["error"]
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        import_result = import_dataframe(
            result["dataframe"]
        )

        return Response(
            {
                "message": (
                    "CSV processing completed."
                ),
                "summary": {
                    "total_rows": result[
                        "total_rows"
                    ],
                    "valid_rows": len(
                        result["dataframe"]
                    ),
                    "invalid_rows": len(
                        result["invalid_rows"]
                    ),
                    "duplicate_rows": result[
                        "duplicate_count"
                    ],
                    "already_existing": import_result[
                        "existing_duplicates"
                    ],
                    "imported": import_result[
                        "imported"
                    ],
                },
                "invalid_details": result[
                    "invalid_rows"
                ],
            },
            status=status.HTTP_200_OK,
        )

    @action(
        detail=False,
        methods=["get"],
        url_path="export-csv",
        pagination_class=None,
    )
    def export_csv(self, request):
        self.require_roles(
            ["Administrator", "Operator"]
        )
        queryset = self.get_queryset()

        data = list(
            queryset.values(
                "date",
                "location",
                "waste_type",
                "quantity_kg",
                "day",
                "holiday",
                "special_event",
                "footfall",
                "temperature",
                "rainfall",
            )
        )

        dataframe = pd.DataFrame(data)

        response = HttpResponse(
            content_type="text/csv"
        )

        response[
            "Content-Disposition"
        ] = (
            'attachment; filename="smart-waste-records.csv"'
        )

        dataframe.to_csv(
            response,
            index=False,
        )

        return response
    
    
    @action(detail=False, methods=["get"], url_path="analytics")
    def analytics(self, request):
        queryset = self.get_queryset()

        analytics_data = get_complete_analytics(queryset)

        return Response(analytics_data)
    
    @action(detail=False, methods=["get"], url_path="ml-dataset")
    def ml_dataset(self, request):
        self.require_roles(
            ["Administrator"]
        )
        summary = get_dataset_summary()

        return Response(summary)
    
    @action(detail=False, methods=["post"], url_path="train-models")
    def train_models(self, request):
        self.require_roles(
            ["Administrator"]
        )
        result = train_all_models()

        if not result["success"]:
            return Response(
                result,
                status=400,
            )

        return Response(result)

    @action(detail=False, methods=["get"], url_path="ml-status")
    def ml_status(self, request):
        self.require_roles(
            ["Administrator"]
        )
        metrics = load_metrics()
        model = load_best_model()

        return Response(
            {
                "trained": model is not None,
                "metrics": metrics,
            }
        )
        
    @action(detail=False, methods=["post"], url_path="predict")
    def predict(self, request):
        required_fields = [
        "day",
        "location",
        "waste_type",
        "holiday",
        "special_event",
        "footfall",
        "temperature",
        "rainfall",
        ]

        missing_fields = [
        field
        for field in required_fields
        if field not in request.data
        ]

        if missing_fields:
            return Response(
                {
                    "error": (
                        "Missing required fields: "
                        + ", ".join(missing_fields)
                    )
                },
                status=400,
                )

        try:
            result = predict_waste(
            request.data
        )

            return Response(result)

        except ValueError as error:
            return Response(
            {
                "error": str(error)
            },
            status=400,
        )

        except Exception as error:
            return Response(
            {
                "error": (
                    "Prediction failed: "
                    + str(error)
                )
            },
            status=500,
        )
            
    @action(detail=False, methods=["get"], url_path="anomalies")
    def anomalies(self, request):
        result = detect_anomalies()

        if not result["success"]:
            return Response(
                result,
                status=400,
            )

        return Response(result)
    
    def perform_create(self, serializer):
        role = get_user_role(self.request.user)

        if role not in ["Administrator", "Operator"]:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "You do not have permission to create waste records."
            )   

        serializer.save()
        
    def perform_update(self, serializer):
        role = get_user_role(self.request.user)

        if role not in ["Administrator", "Operator"]:
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "You do not have permission to update waste records."
            )

        serializer.save()
        
    def perform_destroy(self, instance):
        role = get_user_role(self.request.user)

        if role != "Administrator":
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "Only Administrators can delete waste records."
            )

        instance.delete()
    
@api_view(["GET"])
def collection_plan(request):
    return Response(get_collection_plan())

@api_view(["GET"])
def recommendations(request):
    return Response(get_recommendations())

@api_view(["GET"])
def waste_report(request):
    return export_waste_report()

@api_view(["GET"])
def health_check(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()

        return Response({
            "status": "healthy",
            "database": "connected",
            "service": "Smart Waste Management API",
        })

    except Exception as exc:
        return Response(
            {
                "status": "unhealthy",
                "database": "disconnected",
                "service": "Smart Waste Management API",
                "error": str(exc),
            },
            status=503,
        )