from fastapi import FastAPI, UploadFile, File, HTTPException
import pandas as pd
import os
import random

app = FastAPI()

DATA_PATH = "data/dataset.xlsx"

current_df = None
summary_cache = None


# --------------------------------------------------
# COLUMN NORMALIZATION + SMART MAPPING
# --------------------------------------------------
COLUMN_ALIASES = {
    "citizen id": "citizen_id",
    "citizenid": "citizen_id",

    "aadhaar verified": "aadhaar_verified",
    "aadhaar status": "aadhaar_verified",

    "claim count": "claim_count",
    "claims": "claim_count",

    "account status": "account_status",
    "status": "account_status",

    "scheme amount": "scheme_amount",
    "amount": "scheme_amount"
}


def normalize_columns(df: pd.DataFrame):

    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
    )

    # map aliases
    df.rename(columns=COLUMN_ALIASES, inplace=True)

    # replace spaces after mapping
    df.columns = df.columns.str.replace(" ", "_")

    return df


def clean_data(df: pd.DataFrame):

    df = normalize_columns(df)

    required = [
        "citizen_id",
        "aadhaar_verified",
        "claim_count",
        "account_status",
        "scheme_amount"
    ]

    missing = [col for col in required if col not in df.columns]

    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns: {missing}"
        )

    df = df.drop_duplicates(subset=["citizen_id"])

    df["aadhaar_verified"] = df["aadhaar_verified"].astype(str).str.upper()
    df["account_status"] = df["account_status"].astype(str).str.upper()

    return df


# --------------------------------------------------
# FRAUD RISK ENGINE
# --------------------------------------------------
def calculate_risk(row):

    risk = 0

    if row["claim_count"] >= 4:
        risk += 30

    if row["aadhaar_verified"] != "TRUE":
        risk += 40

    if row["account_status"] != "ACTIVE":
        risk += 20

    if row["scheme_amount"] >= 5000:
        risk += 10

    return min(risk, 100)


# --------------------------------------------------
# ANALYSIS
# --------------------------------------------------
def analyze_dataframe(df: pd.DataFrame):

    df["risk_score"] = df.apply(calculate_risk, axis=1)

    fraud_df = df[df["risk_score"] > 60]

    summary = {
        "total_transactions": int(len(df)),
        "fraud_detected": int(len(fraud_df)),
        "avg_risk_score": float(round(df["risk_score"].mean(), 2)),
        "ledger_integrity": int(100 - (len(fraud_df) / len(df) * 100))
    }

    transactions = df.tail(20).to_dict(orient="records")

    return df, {
        "summary": summary,
        "transactions": transactions
    }


# --------------------------------------------------
# UPLOAD ENDPOINT
# --------------------------------------------------
@app.post("/upload")
async def upload_excel(file: UploadFile = File(...)):
    global current_df, summary_cache

    os.makedirs("data", exist_ok=True)

    with open(DATA_PATH, "wb") as f:
        f.write(await file.read())

    try:
        df = pd.read_excel(DATA_PATH)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Excel file")

    df = clean_data(df)

    current_df, summary_cache = analyze_dataframe(df)

    return {
        "message": "Dataset uploaded successfully",
        "summary": summary_cache
    }


# --------------------------------------------------
# DASHBOARD DATA
# --------------------------------------------------
@app.get("/dashboard")
def get_dashboard():

    if summary_cache is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded")

    return summary_cache


# --------------------------------------------------
# CLAIMS TABLE
# --------------------------------------------------
@app.get("/claims")
def get_claims():

    if current_df is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded")

    return current_df.tail(50).to_dict(orient="records")


# --------------------------------------------------
# THREAT SIMULATION ROUTE (FIXES 404)
# --------------------------------------------------
@app.get("/simulate-attack")
def simulate_attack():

    threats = [
        "Duplicate beneficiary injection attempt",
        "Mass claim bot attack detected",
        "Ledger tampering attempt",
        "Fake Aadhaar batch upload",
        "High-value scheme exploit detected"
    ]

    return {
        "status": "attack_detected",
        "threat": random.choice(threats),
        "severity": random.choice(["LOW", "MEDIUM", "HIGH"]),
        "recommended_action": "Trigger audit + freeze suspicious accounts"
    }
