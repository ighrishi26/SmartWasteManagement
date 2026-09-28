import pandas as pd

from waste.models import WasteRecord


REQUIRED_COLUMNS = [
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
]


ALLOWED_WASTE_TYPES = {
    "Organic",
    "Plastic",
    "Paper",
    "Glass",
    "Metal",
    "E-Waste",
    "Mixed",
    "Other",
}


def clean_boolean(value):
    if pd.isna(value):
        return False

    if isinstance(value, bool):
        return value

    value = str(value).strip().lower()

    return value in {
        "true",
        "1",
        "yes",
        "y",
        "holiday",
        "event",
    }


def clean_csv_dataframe(df):
    df = df.copy()

    df.columns = [
        str(column).strip().lower()
        for column in df.columns
    ]

    missing_columns = [
        column
        for column in REQUIRED_COLUMNS
        if column not in df.columns
    ]

    if missing_columns:
        return {
            "success": False,
            "error": (
                "Missing required columns: "
                + ", ".join(missing_columns)
            ),
        }

    df = df[REQUIRED_COLUMNS].copy()

    df["date"] = pd.to_datetime(
        df["date"],
        errors="coerce",
    )

    df["location"] = (
        df["location"]
        .fillna("")
        .astype(str)
        .str.strip()
    )

    df["waste_type"] = (
        df["waste_type"]
        .fillna("")
        .astype(str)
        .str.strip()
    )

    df["quantity_kg"] = pd.to_numeric(
        df["quantity_kg"],
        errors="coerce",
    )

    df["footfall"] = pd.to_numeric(
        df["footfall"],
        errors="coerce",
    )

    df["temperature"] = pd.to_numeric(
        df["temperature"],
        errors="coerce",
    )

    df["rainfall"] = pd.to_numeric(
        df["rainfall"],
        errors="coerce",
    )

    df["day"] = (
        df["day"]
        .fillna("")
        .astype(str)
        .str.strip()
    )

    df["holiday"] = df["holiday"].apply(
        clean_boolean
    )

    df["special_event"] = df[
        "special_event"
    ].apply(clean_boolean)

    invalid_rows = []

    for index, row in df.iterrows():
        errors = []

        if pd.isna(row["date"]):
            errors.append("Invalid date")

        if not row["location"]:
            errors.append("Location is empty")

        if row["waste_type"] not in ALLOWED_WASTE_TYPES:
            errors.append("Invalid waste type")

        if (
            pd.isna(row["quantity_kg"])
            or row["quantity_kg"] <= 0
        ):
            errors.append(
                "Quantity must be greater than 0"
            )

        if (
            pd.isna(row["footfall"])
            or row["footfall"] < 0
        ):
            errors.append(
                "Footfall cannot be negative"
            )

        if (
            not pd.isna(row["temperature"])
            and (
                row["temperature"] < -50
                or row["temperature"] > 70
            )
        ):
            errors.append(
                "Temperature outside valid range"
            )

        if (
            not pd.isna(row["rainfall"])
            and row["rainfall"] < 0
        ):
            errors.append(
                "Rainfall cannot be negative"
            )

        if not row["day"]:
            errors.append("Day is empty")

        if errors:
            invalid_rows.append(
                {
                    "row": index + 2,
                    "errors": errors,
                }
            )

    valid_mask = ~df.index.isin(
        [
            item["row"] - 2
            for item in invalid_rows
        ]
    )

    valid_df = df[valid_mask].copy()

    duplicate_mask = valid_df.duplicated(
        subset=[
            "date",
            "location",
            "waste_type",
            "quantity_kg",
        ],
        keep="first",
    )

    duplicate_count = int(
        duplicate_mask.sum()
    )

    valid_df = valid_df[
        ~duplicate_mask
    ].copy()

    return {
        "success": True,
        "dataframe": valid_df,
        "invalid_rows": invalid_rows,
        "duplicate_count": duplicate_count,
        "total_rows": len(df),
    }


def import_dataframe(df):
    imported = 0
    existing_duplicates = 0

    for _, row in df.iterrows():
        date_value = row["date"].date()

        exists = WasteRecord.objects.filter(
            date=date_value,
            location=row["location"],
            waste_type=row["waste_type"],
            quantity_kg=float(
                row["quantity_kg"]
            ),
        ).exists()

        if exists:
            existing_duplicates += 1
            continue

        WasteRecord.objects.create(
            date=date_value,
            location=row["location"],
            waste_type=row["waste_type"],
            quantity_kg=float(
                row["quantity_kg"]
            ),
            day=row["day"],
            holiday=bool(row["holiday"]),
            special_event=bool(
                row["special_event"]
            ),
            footfall=int(
                row["footfall"]
            ),
            temperature=(
                None
                if pd.isna(
                    row["temperature"]
                )
                else float(
                    row["temperature"]
                )
            ),
            rainfall=(
                None
                if pd.isna(
                    row["rainfall"]
                )
                else float(
                    row["rainfall"]
                )
            ),
        )

        imported += 1

    return {
        "imported": imported,
        "existing_duplicates": existing_duplicates,
    }