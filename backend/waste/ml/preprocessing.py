import pandas as pd
import numpy as np

from waste.models import WasteRecord


FEATURE_COLUMNS = [
    "day",
    "location",
    "waste_type",
    "holiday",
    "special_event",
    "footfall",
    "temperature",
    "rainfall",
]

TARGET_COLUMN = "quantity_kg"


def get_waste_dataframe():
    records = WasteRecord.objects.all().values(
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
    )

    dataframe = pd.DataFrame(list(records))

    if dataframe.empty:
        return dataframe

    dataframe["date"] = pd.to_datetime(
        dataframe["date"],
        errors="coerce",
    )

    dataframe["quantity_kg"] = pd.to_numeric(
        dataframe["quantity_kg"],
        errors="coerce",
    )

    dataframe["footfall"] = pd.to_numeric(
        dataframe["footfall"],
        errors="coerce",
    )

    dataframe["temperature"] = pd.to_numeric(
        dataframe["temperature"],
        errors="coerce",
    )

    dataframe["rainfall"] = pd.to_numeric(
        dataframe["rainfall"],
        errors="coerce",
    )

    dataframe["holiday"] = dataframe["holiday"].astype(int)
    dataframe["special_event"] = dataframe["special_event"].astype(int)

    return dataframe


def clean_training_data(dataframe):
    if dataframe.empty:
        return dataframe

    dataframe = dataframe.copy()

    dataframe = dataframe.dropna(
        subset=[
            "date",
            "location",
            "waste_type",
            "quantity_kg",
        ]
    )

    dataframe["day"] = dataframe["day"].fillna(
        dataframe["date"].dt.day_name()
    )

    dataframe["footfall"] = dataframe["footfall"].fillna(
        dataframe["footfall"].median()
    )

    dataframe["temperature"] = dataframe["temperature"].fillna(
        dataframe["temperature"].median()
    )

    dataframe["rainfall"] = dataframe["rainfall"].fillna(0)

    dataframe["location"] = (
        dataframe["location"]
        .astype(str)
        .str.strip()
    )

    dataframe["waste_type"] = (
        dataframe["waste_type"]
        .astype(str)
        .str.strip()
    )

    dataframe["day"] = (
        dataframe["day"]
        .astype(str)
        .str.strip()
    )

    dataframe = dataframe[
        dataframe["quantity_kg"] > 0
    ].copy()

    dataframe["footfall"] = dataframe["footfall"].clip(
        lower=0
    )

    dataframe["rainfall"] = dataframe["rainfall"].clip(
        lower=0
    )

    return dataframe


def prepare_features(dataframe):
    dataframe = clean_training_data(dataframe)

    if dataframe.empty:
        return pd.DataFrame(), pd.Series(dtype=float)

    features = dataframe[FEATURE_COLUMNS].copy()
    target = dataframe[TARGET_COLUMN].copy()

    categorical_columns = [
        "day",
        "location",
        "waste_type",
    ]

    numerical_columns = [
        "holiday",
        "special_event",
        "footfall",
        "temperature",
        "rainfall",
    ]

    features = pd.get_dummies(
        features,
        columns=categorical_columns,
        dtype=int,
    )

    for column in numerical_columns:
        features[column] = pd.to_numeric(
            features[column],
            errors="coerce",
        )

    features = features.replace(
        [np.inf, -np.inf],
        np.nan,
    )

    features = features.fillna(0)

    return features, target


def get_training_dataset():
    dataframe = get_waste_dataframe()

    if dataframe.empty:
        return {
            "dataframe": dataframe,
            "features": pd.DataFrame(),
            "target": pd.Series(dtype=float),
        }

    features, target = prepare_features(dataframe)

    return {
        "dataframe": dataframe,
        "features": features,
        "target": target,
    }


def get_dataset_summary():
    dataframe = get_waste_dataframe()

    if dataframe.empty:
        return {
            "total_records": 0,
            "locations": 0,
            "waste_types": 0,
            "date_from": None,
            "date_to": None,
            "missing_values": {},
        }

    cleaned = clean_training_data(dataframe)

    return {
        "total_records": len(dataframe),
        "usable_records": len(cleaned),
        "locations": int(
            dataframe["location"].nunique()
        ),
        "waste_types": int(
            dataframe["waste_type"].nunique()
        ),
        "date_from": (
            dataframe["date"].min().date().isoformat()
            if dataframe["date"].notna().any()
            else None
        ),
        "date_to": (
            dataframe["date"].max().date().isoformat()
            if dataframe["date"].notna().any()
            else None
        ),
        "missing_values": {
            column: int(dataframe[column].isna().sum())
            for column in dataframe.columns
        },
    }