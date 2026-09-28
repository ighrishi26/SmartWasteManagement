import pandas as pd

from .model_utils import load_best_model
from waste.services.threshold_service import get_collection_priority


def prepare_prediction_features(data):
    model_data = load_best_model()

    if model_data is None:
        raise ValueError(
            "No trained model is available. Please train the models first."
        )

    feature_columns = model_data["feature_columns"]

    dataframe = pd.DataFrame([{
        "day": data["day"],
        "location": data["location"],
        "waste_type": data["waste_type"],
        "holiday": int(data["holiday"]),
        "special_event": int(data["special_event"]),
        "footfall": float(data["footfall"]),
        "temperature": float(data["temperature"]),
        "rainfall": float(data["rainfall"]),
    }])

    categorical_columns = [
        "day",
        "location",
        "waste_type",
    ]

    dataframe = pd.get_dummies(
        dataframe,
        columns=categorical_columns,
        dtype=int,
    )

    dataframe = dataframe.replace(
        [float("inf"), float("-inf")],
        0,
    )

    for column in feature_columns:
        if column not in dataframe.columns:
            dataframe[column] = 0

    dataframe = dataframe[feature_columns]

    return dataframe


def predict_waste(data):
    model_data = load_best_model()

    if model_data is None:
        raise ValueError(
            "No trained model is available. Please train the models first."
        )

    model = model_data["model"]

    features = prepare_prediction_features(data)

    prediction = model.predict(features)[0]

    prediction = max(
        float(prediction),
        0,
    )

    priority = get_collection_priority(
        prediction
    )

    return {
        "predicted_waste_kg": round(
            prediction,
            2,
        ),
        "collection_priority": priority["level"],
        "priority_label": priority["label"],
        "model_name": model_data["model_name"],
    }