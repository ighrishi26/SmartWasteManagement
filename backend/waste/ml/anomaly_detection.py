import pandas as pd
from sklearn.ensemble import IsolationForest

from .preprocessing import get_waste_dataframe


def detect_anomalies():
    dataframe = get_waste_dataframe()

    if dataframe.empty:
        return {
            "success": False,
            "error": "No waste records are available for anomaly detection.",
        }

    dataframe = dataframe.copy()

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

    dataframe["quantity_kg"] = pd.to_numeric(
        dataframe["quantity_kg"],
        errors="coerce",
    )

    dataframe["holiday"] = dataframe["holiday"].astype(int)
    dataframe["special_event"] = dataframe["special_event"].astype(int)

    dataframe["footfall"] = dataframe["footfall"].fillna(
        dataframe["footfall"].median()
    )

    dataframe["temperature"] = dataframe["temperature"].fillna(
        dataframe["temperature"].median()
    )

    dataframe["rainfall"] = dataframe["rainfall"].fillna(0)

    dataframe = dataframe.dropna(
        subset=["quantity_kg"]
    ).copy()

    if len(dataframe) < 5:
        return {
            "success": False,
            "error": (
                "At least 5 usable waste records are required "
                "for anomaly detection."
            ),
        }

    features = dataframe[
        [
            "quantity_kg",
            "footfall",
            "temperature",
            "rainfall",
            "holiday",
            "special_event",
        ]
    ].copy()

    model = IsolationForest(
        contamination="auto",
        random_state=42,
    )

    dataframe["anomaly_score"] = model.fit_predict(features)

    dataframe["is_anomaly"] = (
        dataframe["anomaly_score"] == -1
    )

    dataframe["anomaly_score_value"] = model.decision_function(
        features
    )

    results = []

    for _, row in dataframe.iterrows():
        results.append(
            {
                "id": int(row["id"]),
                "date": (
                    row["date"].date().isoformat()
                    if pd.notna(row["date"])
                    else None
                ),
                "location": row["location"],
                "waste_type": row["waste_type"],
                "quantity_kg": round(
                    float(row["quantity_kg"]),
                    2,
                ),
                "footfall": int(row["footfall"]),
                "temperature": (
                    round(float(row["temperature"]), 2)
                    if pd.notna(row["temperature"])
                    else None
                ),
                "rainfall": (
                    round(float(row["rainfall"]), 2)
                    if pd.notna(row["rainfall"])
                    else None
                ),
                "holiday": bool(row["holiday"]),
                "special_event": bool(row["special_event"]),
                "is_anomaly": bool(row["is_anomaly"]),
                "anomaly_score": round(
                    float(row["anomaly_score_value"]),
                    4,
                ),
            }
        )

    anomaly_records = [
        item for item in results
        if item["is_anomaly"]
    ]

    return {
        "success": True,
        "total_records": len(results),
        "anomaly_count": len(anomaly_records),
        "normal_count": len(results) - len(anomaly_records),
        "anomalies": anomaly_records,
        "records": results,
    }