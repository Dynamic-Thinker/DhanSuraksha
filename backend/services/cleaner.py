import pandas as pd


def clean_data(df: pd.DataFrame):

    # normalize columns FIRST
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_")
    )

    required = ["citizen_id", "aadhaar_verified"]

    for col in required:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")

    # remove duplicate citizens
    df = df.drop_duplicates(subset=["citizen_id"])

    # normalize aadhaar verification
    df["aadhaar_verified"] = (
        df["aadhaar_verified"]
        .astype(str)
        .str.upper()
    )

    return df
