from django.db.models import Sum, Count, Avg

from waste.models import WasteRecord
from waste.services.threshold_service import get_thresholds


def get_collection_plan():
    thresholds = get_thresholds()

    locations = (
        WasteRecord.objects
        .values("location")
        .annotate(
            total_waste=Sum("quantity_kg"),
            average_waste=Avg("quantity_kg"),
            record_count=Count("id"),
        )
        .order_by("-total_waste")
    )

    plan = []

    for item in locations:
        total_waste = round(item["total_waste"] or 0, 2)

        if total_waste < thresholds["low_max_kg"]:
            priority = "Low"
            priority_label = "Low Priority"
            recommendation = "Routine collection"
        elif total_waste < thresholds["medium_max_kg"]:
            priority = "Medium"
            priority_label = "Medium Priority"
            recommendation = "Schedule collection"
        else:
            priority = "High"
            priority_label = "High Priority"
            recommendation = "Collect immediately"

        plan.append({
            "location": item["location"],
            "total_waste": total_waste,
            "average_waste": round(item["average_waste"] or 0, 2),
            "record_count": item["record_count"],
            "priority": priority,
            "priority_label": priority_label,
            "recommendation": recommendation,
        })

    priority_summary = {
        "low": sum(1 for item in plan if item["priority"] == "Low"),
        "medium": sum(1 for item in plan if item["priority"] == "Medium"),
        "high": sum(1 for item in plan if item["priority"] == "High"),
    }

    return {
        "thresholds": thresholds,
        "summary": {
            "total_locations": len(plan),
            "total_waste": round(
                sum(item["total_waste"] for item in plan),
                2,
            ),
            "high_priority": priority_summary["high"],
            "medium_priority": priority_summary["medium"],
            "low_priority": priority_summary["low"],
        },
        "locations": plan,
    }