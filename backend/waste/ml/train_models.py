import time

from sklearn.ensemble import (
    RandomForestRegressor,
    GradientBoostingRegressor,
)
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)
from sklearn.model_selection import train_test_split

from .preprocessing import get_training_dataset
from .model_utils import save_model, save_metrics


def train_all_models():
    dataset = get_training_dataset()

    features = dataset["features"]
    target = dataset["target"]

    if features.empty or target.empty:
        return {
            "success": False,
            "error": "Not enough data available for model training.",
        }

    if len(features) < 5:
        return {
            "success": False,
            "error": (
                "At least 5 usable records are required "
                "for model training."
            ),
        }

    X_train, X_test, y_train, y_test = train_test_split(
        features,
        target,
        test_size=0.2,
        random_state=42,
    )

    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            n_jobs=-1,
        ),
        "Gradient Boosting": GradientBoostingRegressor(
            n_estimators=100,
            random_state=42,
        ),
    }

    results = []

    trained_models = {}

    for model_name, model in models.items():
        start_time = time.perf_counter()

        model.fit(
            X_train,
            y_train,
        )

        training_time = time.perf_counter() - start_time

        predictions = model.predict(X_test)

        mae = mean_absolute_error(
            y_test,
            predictions,
        )

        rmse = mean_squared_error(
            y_test,
            predictions,
        ) ** 0.5

        r2 = r2_score(
            y_test,
            predictions,
        )

        result = {
            "model": model_name,
            "mae": round(float(mae), 4),
            "rmse": round(float(rmse), 4),
            "r2": round(float(r2), 4),
            "training_time_seconds": round(
                float(training_time),
                4,
            ),
        }

        results.append(result)
        trained_models[model_name] = model

    best_result = min(
        results,
        key=lambda item: item["mae"],
    )

    best_model_name = best_result["model"]

    save_model(
        trained_models[best_model_name],
        list(features.columns),
        best_model_name,
    )

    training_summary = {
        "success": True,
        "dataset_size": len(features),
        "training_records": len(X_train),
        "testing_records": len(X_test),
        "models": results,
        "best_model": best_model_name,
        "best_model_metrics": best_result,
    }

    save_metrics(training_summary)

    return training_summary