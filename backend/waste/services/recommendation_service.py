from django.db.models import Avg, Sum, Count

from waste.models import WasteRecord
from waste.services.threshold_service import get_thresholds


def get_recommendations():
    records = WasteRecord.objects.all()
    thresholds = get_thresholds()

    recommendations = []

    if not records.exists():
        return {
            "summary": {
                "total_recommendations": 0,
                "high_priority": 0,
                "medium_priority": 0,
                "informational": 0,
            },
            "recommendations": [],
        }

    total_waste = records.aggregate(
        total=Sum("quantity_kg")
    )["total"] or 0

    average_waste = records.aggregate(
        average=Avg("quantity_kg")
    )["average"] or 0

    highest_location = (
        records
        .values("location")
        .annotate(
            total_waste=Sum("quantity_kg"),
            record_count=Count("id"),
        )
        .order_by("-total_waste")
        .first()
    )

    highest_waste_type = (
        records
        .values("waste_type")
        .annotate(
            total_waste=Sum("quantity_kg"),
            record_count=Count("id"),
        )
        .order_by("-total_waste")
        .first()
    )

    event_average = records.filter(
        special_event=True
    ).aggregate(
        average=Avg("quantity_kg")
    )["average"]

    normal_average = records.filter(
        special_event=False
    ).aggregate(
        average=Avg("quantity_kg")
    )["average"]

    holiday_average = records.filter(
        holiday=True
    ).aggregate(
        average=Avg("quantity_kg")
    )["average"]

    normal_day_average = records.filter(
        holiday=False
    ).aggregate(
        average=Avg("quantity_kg")
    )["average"]

    if highest_location:
        recommendations.append({
            "type": "high",
            "title": "High-waste location identified",
            "description": (
                f"{highest_location['location']} has the highest "
                f"recorded waste volume at "
                f"{round(highest_location['total_waste'], 2)} kg."
            ),
            "action": "Prioritize this location during collection planning.",
        })

    if highest_waste_type:
        recommendations.append({
            "type": "medium",
            "title": "Dominant waste category",
            "description": (
                f"{highest_waste_type['waste_type']} represents the "
                f"largest recorded waste category with "
                f"{round(highest_waste_type['total_waste'], 2)} kg."
            ),
            "action": "Consider targeted segregation and collection planning.",
        })

    if event_average and normal_average:
        if event_average > normal_average:
            increase = (
                (event_average - normal_average)
                / normal_average
            ) * 100

            recommendations.append({
                "type": "high",
                "title": "Special events increase waste",
                "description": (
                    f"Average waste during special events is "
                    f"{round(event_average, 2)} kg compared with "
                    f"{round(normal_average, 2)} kg on normal days."
                ),
                "action": (
                    f"Consider additional collection capacity "
                    f"when events are scheduled. Observed increase: "
                    f"{round(increase, 1)}%."
                ),
            })

    if holiday_average and normal_day_average:
        if holiday_average > normal_day_average:
            recommendations.append({
                "type": "medium",
                "title": "Higher holiday waste observed",
                "description": (
                    f"Average holiday waste is "
                    f"{round(holiday_average, 2)} kg compared with "
                    f"{round(normal_day_average, 2)} kg on normal days."
                ),
                "action": "Review collection schedules around holidays.",
            })

    high_threshold_count = records.filter(
        quantity_kg__gte=thresholds["medium_max_kg"]
    ).count()

    if high_threshold_count > 0:
        recommendations.append({
            "type": "high",
            "title": "High-volume records detected",
            "description": (
                f"{high_threshold_count} waste records are at or above "
                f"the high collection threshold of "
                f"{thresholds['medium_max_kg']} kg."
            ),
            "action": "Review these records for immediate collection planning.",
        })

    if average_waste < thresholds["low_max_kg"]:
        recommendations.append({
            "type": "info",
            "title": "Average waste is within the low range",
            "description": (
                f"Overall average waste is "
                f"{round(average_waste, 2)} kg per record."
            ),
            "action": "Continue routine monitoring and collection.",
        })

    return {
        "summary": {
            "total_recommendations": len(recommendations),
            "high_priority": sum(
                1 for item in recommendations
                if item["type"] == "high"
            ),
            "medium_priority": sum(
                1 for item in recommendations
                if item["type"] == "medium"
            ),
            "informational": sum(
                1 for item in recommendations
                if item["type"] == "info"
            ),
        },
        "recommendations": recommendations,
    }