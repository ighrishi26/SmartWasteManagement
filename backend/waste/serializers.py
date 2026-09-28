from rest_framework import serializers

from .models import WasteRecord


class WasteRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = WasteRecord
        fields = [
            "id",
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
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_location(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Location cannot be empty."
            )

        return value

    def validate_quantity_kg(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than 0 kg."
            )

        return value

    def validate_footfall(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Footfall cannot be negative."
            )

        return value

    def validate_temperature(self, value):
        if value is not None and (
            value < -50 or value > 70
        ):
            raise serializers.ValidationError(
                "Temperature must be between -50°C and 70°C."
            )

        return value

    def validate_rainfall(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError(
                "Rainfall cannot be negative."
            )

        return value