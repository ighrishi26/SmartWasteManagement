import json
import os
import joblib


MODEL_DIR = os.path.join(
    os.path.dirname(
        os.path.dirname(
            os.path.dirname(__file__)
        )
    ),
    "trained_models",
)


BEST_MODEL_PATH = os.path.join(
    MODEL_DIR,
    "best_waste_model.joblib",
)


METRICS_PATH = os.path.join(
    MODEL_DIR,
    "model_metrics.json",
)


def ensure_model_directory():
    os.makedirs(MODEL_DIR, exist_ok=True)


def save_model(model, feature_columns, model_name):
    ensure_model_directory()

    model_data = {
        "model": model,
        "feature_columns": feature_columns,
        "model_name": model_name,
    }

    joblib.dump(
        model_data,
        BEST_MODEL_PATH,
    )


def load_best_model():
    if not os.path.exists(BEST_MODEL_PATH):
        return None

    return joblib.load(BEST_MODEL_PATH)


def save_metrics(metrics):
    ensure_model_directory()

    with open(
        METRICS_PATH,
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            metrics,
            file,
            indent=4,
        )


def load_metrics():
    if not os.path.exists(METRICS_PATH):
        return None

    with open(
        METRICS_PATH,
        "r",
        encoding="utf-8",
    ) as file:
        return json.load(file)