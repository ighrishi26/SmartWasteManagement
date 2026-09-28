from waste.models import CollectionThreshold


DEFAULT_LOW_MAX = 50
DEFAULT_MEDIUM_MAX = 150


def get_thresholds():
    threshold = CollectionThreshold.objects.first()

    if threshold is None:
        threshold = CollectionThreshold.objects.create(
            low_max_kg=DEFAULT_LOW_MAX,
            medium_max_kg=DEFAULT_MEDIUM_MAX,
        )

    return {
        "low_max_kg": threshold.low_max_kg,
        "medium_max_kg": threshold.medium_max_kg,
    }


def get_collection_priority(quantity):
    thresholds = get_thresholds()

    if quantity < thresholds["low_max_kg"]:
        return {
            "level": "Low",
            "label": "Low Priority",
        }

    if quantity < thresholds["medium_max_kg"]:
        return {
            "level": "Medium",
            "label": "Medium Priority",
        }

    return {
        "level": "High",
        "label": "High Priority",
    }