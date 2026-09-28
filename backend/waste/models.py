from django.db import models


class WasteRecord(models.Model):
    WASTE_TYPE_CHOICES = [
        ("Organic", "Organic"),
        ("Plastic", "Plastic"),
        ("Paper", "Paper"),
        ("Glass", "Glass"),
        ("Metal", "Metal"),
        ("E-Waste", "E-Waste"),
        ("Mixed", "Mixed"),
        ("Other", "Other"),
    ]

    date = models.DateField()

    location = models.CharField(max_length=150)

    waste_type = models.CharField(
        max_length=50,
        choices=WASTE_TYPE_CHOICES,
    )

    quantity_kg = models.FloatField()

    day = models.CharField(max_length=20)

    holiday = models.BooleanField(default=False)

    special_event = models.BooleanField(default=False)

    footfall = models.PositiveIntegerField(default=0)

    temperature = models.FloatField(null=True, blank=True)

    rainfall = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        verbose_name = "Waste Record"
        verbose_name_plural = "Waste Records"

    def __str__(self):
        return f"{self.date} - {self.location} - {self.waste_type}"
    

class CollectionThreshold(models.Model):
    low_max_kg = models.FloatField(default=50)
    medium_max_kg = models.FloatField(default=150)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Collection Threshold"
        verbose_name_plural = "Collection Thresholds"

    def __str__(self):
        return (
            f"Low < {self.low_max_kg} kg | "
            f"Medium < {self.medium_max_kg} kg"
        )