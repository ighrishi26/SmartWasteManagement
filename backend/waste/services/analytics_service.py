from collections import defaultdict

from django.db.models import Avg, Max, Min, Sum, Count

from waste.models import WasteRecord


def get_basic_statistics(queryset):
    statistics = queryset.aggregate(
        total_waste=Sum("quantity_kg"),
        average_waste=Avg("quantity_kg"),
        maximum_waste=Max("quantity_kg"),
        minimum_waste=Min("quantity_kg"),
        total_records=Count("id"),
    )

    return {
        "total_waste": round(statistics["total_waste"] or 0, 2),
        "average_waste": round(statistics["average_waste"] or 0, 2),
        "maximum_waste": round(statistics["maximum_waste"] or 0, 2),
        "minimum_waste": round(statistics["minimum_waste"] or 0, 2),
        "total_records": statistics["total_records"] or 0,
    }


def get_location_analysis(queryset):
    locations = (
        queryset
        .values("location")
        .annotate(
            total_waste=Sum("quantity_kg"),
            average_waste=Avg("quantity_kg"),
            record_count=Count("id"),
        )
        .order_by("-total_waste")
    )

    return [
        {
            "location": item["location"],
            "total_waste": round(item["total_waste"] or 0, 2),
            "average_waste": round(item["average_waste"] or 0, 2),
            "record_count": item["record_count"],
        }
        for item in locations
    ]


def get_waste_type_analysis(queryset):
    waste_types = (
        queryset
        .values("waste_type")
        .annotate(
            total_waste=Sum("quantity_kg"),
            average_waste=Avg("quantity_kg"),
            record_count=Count("id"),
        )
        .order_by("-total_waste")
    )

    return [
        {
            "waste_type": item["waste_type"],
            "total_waste": round(item["total_waste"] or 0, 2),
            "average_waste": round(item["average_waste"] or 0, 2),
            "record_count": item["record_count"],
        }
        for item in waste_types
    ]


def get_daily_trends(queryset):
    records = queryset.values(
        "date",
        "quantity_kg",
    ).order_by("date")

    daily_data = defaultdict(list)

    for record in records:
        daily_data[record["date"]].append(record["quantity_kg"])

    result = []

    for date_value, quantities in sorted(daily_data.items()):
        total = sum(quantities)
        average = total / len(quantities)

        result.append(
            {
                "date": date_value.isoformat(),
                "total_waste": round(total, 2),
                "average_waste": round(average, 2),
                "record_count": len(quantities),
            }
        )

    return result


def get_monthly_trends(queryset):
    records = queryset.values(
        "date",
        "quantity_kg",
    ).order_by("date")

    monthly_data = defaultdict(list)

    for record in records:
        month_key = record["date"].strftime("%Y-%m")
        monthly_data[month_key].append(record["quantity_kg"])

    result = []

    for month, quantities in sorted(monthly_data.items()):
        total = sum(quantities)
        average = total / len(quantities)

        result.append(
            {
                "month": month,
                "total_waste": round(total, 2),
                "average_waste": round(average, 2),
                "record_count": len(quantities),
            }
        )

    return result


def get_holiday_analysis(queryset):
    holiday_data = (
        queryset
        .values("holiday")
        .annotate(
            total_waste=Sum("quantity_kg"),
            average_waste=Avg("quantity_kg"),
            record_count=Count("id"),
        )
        .order_by("holiday")
    )

    result = []

    for item in holiday_data:
        result.append(
            {
                "category": (
                    "Holiday"
                    if item["holiday"]
                    else "Normal Day"
                ),
                "total_waste": round(
                    item["total_waste"] or 0,
                    2,
                ),
                "average_waste": round(
                    item["average_waste"] or 0,
                    2,
                ),
                "record_count": item["record_count"],
            }
        )

    return result


def get_special_event_analysis(queryset):
    event_data = (
        queryset
        .values("special_event")
        .annotate(
            total_waste=Sum("quantity_kg"),
            average_waste=Avg("quantity_kg"),
            record_count=Count("id"),
        )
        .order_by("special_event")
    )

    result = []

    for item in event_data:
        result.append(
            {
                "category": (
                    "Special Event"
                    if item["special_event"]
                    else "Normal Day"
                ),
                "total_waste": round(
                    item["total_waste"] or 0,
                    2,
                ),
                "average_waste": round(
                    item["average_waste"] or 0,
                    2,
                ),
                "record_count": item["record_count"],
            }
        )

    return result


def get_footfall_analysis(queryset):
    records = (
        queryset
        .values(
            "date",
            "location",
            "footfall",
            "quantity_kg",
        )
        .order_by("date")
    )

    return [
        {
            "date": (
                item["date"].isoformat()
                if item["date"]
                else None
            ),
            "location": item["location"],
            "footfall": item["footfall"],
            "waste": round(item["quantity_kg"], 2),
        }
        for item in records
    ]


def get_complete_analytics(queryset=None):
    if queryset is None:
        queryset = WasteRecord.objects.all()

    return {
        "statistics": get_basic_statistics(queryset),
        "locations": get_location_analysis(queryset),
        "waste_types": get_waste_type_analysis(queryset),
        "daily_trends": get_daily_trends(queryset),
        "monthly_trends": get_monthly_trends(queryset),
        "holiday_analysis": get_holiday_analysis(queryset),
        "special_event_analysis": get_special_event_analysis(queryset),
        "footfall_analysis": get_footfall_analysis(queryset),
    }