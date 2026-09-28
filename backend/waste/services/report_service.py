import csv

from django.http import HttpResponse

from waste.models import WasteRecord


def export_waste_report():
    records = WasteRecord.objects.all().order_by("-date", "-created_at")

    response = HttpResponse(
        content_type="text/csv"
    )

    response["Content-Disposition"] = (
        'attachment; filename="smart-waste-report.csv"'
    )

    writer = csv.writer(response)

    writer.writerow([
        "Date",
        "Location",
        "Waste Type",
        "Quantity (kg)",
        "Day",
        "Holiday",
        "Special Event",
        "Footfall",
        "Temperature",
        "Rainfall",
    ])

    for record in records:
        writer.writerow([
            record.date,
            record.location,
            record.waste_type,
            record.quantity_kg,
            record.day,
            "Yes" if record.holiday else "No",
            "Yes" if record.special_event else "No",
            record.footfall,
            record.temperature,
            record.rainfall,
        ])

    return response