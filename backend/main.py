from __future__ import annotations

from io import BytesIO
from pathlib import Path
import hashlib
import random
import secrets
import sqlite3
from typing import Any

import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="DhanSuraksha API", version="1.2.0")

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
AUTH_DB_PATH = DATA_DIR / "auth.db"

ALLOWED_DEPARTMENTS = {"Pension", "Food", "Health"}
OFFICER_ROLE = "Welfare Audit Officer"


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    department: str


class LoginRequest(BaseModel):
    email: str
    password: str


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


def get_db_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(AUTH_DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_auth_db() -> None:
    with get_db_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS officers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                department TEXT NOT NULL,
                role TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.commit()


def hash_password(password: str, salt: str | None = None) -> str:
    effective_salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), effective_salt.encode("utf-8"), 120000)
    return f"{effective_salt}${digest.hex()}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, digest_hex = stored_hash.split("$", 1)
    except ValueError:
        return False

    candidate = hash_password(password, salt)
    _, candidate_digest = candidate.split("$", 1)
    return secrets.compare_digest(candidate_digest, digest_hex)


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
    init_auth_db()

    try:
        load_dataset_from_disk(DATA_PATH)
    except Exception:
        pass


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/auth/register")
def register_officer(payload: RegisterRequest) -> dict[str, Any]:
    name = payload.name.strip()
    email = payload.email.strip().lower()
    department = payload.department.strip()
    password = payload.password

    if not name or not email or not password:
        raise HTTPException(status_code=400, detail="Name, email, and password are required")
    if department not in ALLOWED_DEPARTMENTS:
        raise HTTPException(status_code=400, detail=f"Department must be one of {sorted(ALLOWED_DEPARTMENTS)}")
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    password_hash = hash_password(password)

    try:
        with get_db_connection() as connection:
            connection.execute(
                "INSERT INTO officers (name, email, password_hash, department, role) VALUES (?, ?, ?, ?, ?)",
                (name, email, password_hash, department, OFFICER_ROLE),
            )
            connection.commit()
    except sqlite3.IntegrityError as exc:
        raise HTTPException(status_code=409, detail="Officer with this email already exists") from exc

    return {
        "message": "Officer registered successfully",
        "user": {
            "name": name,
            "email": email,
            "department": department,
            "role": OFFICER_ROLE,
        },
    }


@app.post("/auth/login")
def login_officer(payload: LoginRequest) -> dict[str, Any]:
    email = payload.email.strip().lower()
    password = payload.password

    with get_db_connection() as connection:
        row = connection.execute(
            "SELECT name, email, department, role, password_hash FROM officers WHERE email = ?",
            (email,),
        ).fetchone()

    if row is None or not verify_password(password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "user": {
            "name": row["name"],
            "email": row["email"],
            "department": row["department"],
            "role": row["role"],
        },
    }


def parse_uploaded_dataset(file_bytes: bytes, filename: str | None) -> pd.DataFrame:
    suffix = Path(filename or "").suffix.lower()

    if suffix == ".csv":
        try:
            return pd.read_csv(BytesIO(file_bytes))
        except Exception as exc:
            raise HTTPException(status_code=400, detail="Invalid CSV file") from exc

    try:
        return pd.read_excel(BytesIO(file_bytes), engine="openpyxl")
    except Exception as excel_exc:
        # Some users rename CSV files with spreadsheet extensions.
        try:
            return pd.read_csv(BytesIO(file_bytes))
        except Exception:
            raise HTTPException(
                status_code=400,
                detail="Unable to parse uploaded file. Please upload a valid .xlsx or .csv dataset.",
            ) from excel_exc


@app.post("/upload")
async def upload_excel(file: UploadFile = File(...)) -> dict[str, Any]:
    global current_df, summary_cache

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    file_bytes = await file.read()

    df = parse_uploaded_dataset(file_bytes, file.filename)
    df = clean_data(df)
    current_df, summary_cache = analyze_dataframe(df)

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
