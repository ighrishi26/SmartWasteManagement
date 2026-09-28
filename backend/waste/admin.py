from django.contrib import admin

from .models import WasteRecord, CollectionThreshold


@admin.register(WasteRecord)
class WasteRecordAdmin(admin.ModelAdmin):
    list_display = (
        "date",
        "location",
        "waste_type",
        "quantity_kg",
        "holiday",
        "special_event",
        "footfall",
        "temperature",
        "rainfall",
    )

    list_filter = (
        "waste_type",
        "location",
        "holiday",
        "special_event",
    )

    search_fields = (
        "location",
        "waste_type",
    )

    ordering = (
        "-date",
    )
    
@admin.register(CollectionThreshold)
class CollectionThresholdAdmin(admin.ModelAdmin):
    list_display = (
        "low_max_kg",
        "medium_max_kg",
        "updated_at",
    )