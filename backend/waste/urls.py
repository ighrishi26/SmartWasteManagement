from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import WasteRecordViewSet
from .views import health_check


router = DefaultRouter()

router.register(
    r"waste-records",
    WasteRecordViewSet,
    basename="waste-record"
)


urlpatterns = [
    path(
        "waste-records/collection-plan/",
        views.collection_plan,
        name="collection-plan",
    ),
    path(
        "waste-records/recommendations/",
        views.recommendations,
        name="recommendations",
    ),
    path(
        "waste-records/report/",
        views.waste_report,
        name="waste-report",
    ),
    path(
        "",
        include(router.urls),
    ),
    path("health/", health_check, name="health-check"),
]