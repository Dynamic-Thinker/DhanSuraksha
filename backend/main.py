from __future__ import annotations

from io import BytesIO
from pathlib import Path
import random
from typing import Any

import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DhanSuraksha API", version="1.1.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = Path("data")
if not DATA_DIR.is_absolute():
    DATA_DIR = BASE_DIR / DATA_DIR
DATA_PATH = DATA_DIR / "dataset.xlsx"

current_df: pd.DataFrame | None = None
summary_cache: dict[str, Any] | None = None

COLUMN_ALIASES = {
    "citizen id": "citizen_id",
    "citizenid": "citizen_id",
    "aadhaar verified": "aadhaar_verified",
    "aadhaar status": "aadhaar_verified",
    "aadhaar_linked": "aadhaar_verified",
    "claim count": "claim_count",
    "claims": "claim_count",
    "account status": "account_status",
    "status": "account_status",
    "scheme amount": "scheme_amount",
    "amount": "scheme_amount",
    "scheme eligibility": "scheme_eligibility",
}


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df.columns = df.columns.str.strip().str.lower()
    df.rename(columns=COLUMN_ALIASES, inplace=True)
    df.columns = df.columns.str.replace(" ", "_")
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = normalize_columns(df)

    required = ["citizen_id", "aadhaar_verified", "claim_count", "account_status", "scheme_amount"]
    missing = [col for col in required if col not in df.columns]

    if missing:
        raise HTTPException(status_code=400, detail=f"Missing required columns: {missing}")

    df = df.drop_duplicates(subset=["citizen_id"])

    df["aadhaar_verified"] = df["aadhaar_verified"].astype(str).str.upper().str.strip()
    df["account_status"] = df["account_status"].astype(str).str.upper().str.strip()
    df["claim_count"] = pd.to_numeric(df["claim_count"], errors="coerce").fillna(0)
    df["scheme_amount"] = pd.to_numeric(df["scheme_amount"], errors="coerce").fillna(0)

    return df


def calculate_risk(row: pd.Series) -> int:
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


def analyze_dataframe(df: pd.DataFrame) -> tuple[pd.DataFrame, dict[str, Any]]:
    if df.empty:
        return df, {
            "summary": {
                "total_transactions": 0,
                "fraud_detected": 0,
                "avg_risk_score": 0.0,
                "ledger_integrity": 100,
            },
            "transactions": [],
        }

    df["risk_score"] = df.apply(calculate_risk, axis=1)
    fraud_df = df[df["risk_score"] > 60]

    summary = {
        "total_transactions": int(len(df)),
        "fraud_detected": int(len(fraud_df)),
        "avg_risk_score": float(round(df["risk_score"].mean(), 2)),
        "ledger_integrity": int(100 - (len(fraud_df) / len(df) * 100)),
    }

    transactions = df.tail(20).to_dict(orient="records")

    return df, {"summary": summary, "transactions": transactions}


def load_dataset_from_disk(path: Path = DATA_PATH) -> None:
    global current_df, summary_cache

    if not path.exists():
        return

    df = pd.read_excel(path)
    df = clean_data(df)
    current_df, summary_cache = analyze_dataframe(df)


@app.on_event("startup")
def startup_event() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    try:
        load_dataset_from_disk(DATA_PATH)
    except Exception:
        # Keep startup resilient; users can re-upload a fresh file.
        pass


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/upload")
async def upload_excel(file: UploadFile = File(...)) -> dict[str, Any]:
    global current_df, summary_cache

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    file_bytes = await file.read()

    try:
        # Parse in-memory first so upload works even when dataset file path is locked/read-only.
        df = pd.read_excel(BytesIO(file_bytes))
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid Excel file") from exc

    df = clean_data(df)
    current_df, summary_cache = analyze_dataframe(df)

    # Best-effort persistence for startup cache. Do not fail request on write-permission issues.
    try:
        DATA_PATH.write_bytes(file_bytes)
    except PermissionError:
        pass
    except OSError:
        pass

    return {"message": "Dataset uploaded successfully", "summary": summary_cache}


@app.get("/dashboard")
def get_dashboard() -> dict[str, Any]:
    if summary_cache is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
    return summary_cache


@app.get("/claims")
def get_claims() -> list[dict[str, Any]]:
    if current_df is None:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
    return current_df.tail(50).to_dict(orient="records")


@app.get("/fraud-alerts")
def get_fraud_alerts() -> dict[str, list[dict[str, Any]]]:
    if current_df is None or "risk_score" not in current_df.columns:
        return {"alerts": []}

    alerts = current_df[current_df["risk_score"] > 70].tail(20).to_dict(orient="records")
    return {"alerts": alerts}


@app.get("/simulate-attack")
def simulate_attack() -> dict[str, str]:
    threats = [
        "Duplicate beneficiary injection attempt",
        "Mass claim bot attack detected",
        "Ledger tampering attempt",
        "Fake Aadhaar batch upload",
        "High-value scheme exploit detected",
    ]

    return {
        "status": "attack_detected",
        "threat": random.choice(threats),
        "severity": random.choice(["LOW", "MEDIUM", "HIGH"]),
        "recommended_action": "Trigger audit + freeze suspicious accounts",
    }
