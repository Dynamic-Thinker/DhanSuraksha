import pandas as pd


def clean_data(df):
    # remove duplicate citizens
    df = df.drop_duplicates(subset=["Citizen_ID"])

    # normalize columns
    df["Aadhaar_Verified"] = df["Aadhaar_Verified"].astype(str).str.upper()

    return df


def calculate_risk(row):
    risk = 0

    # High claim frequency
    if row["Claim_Count"] >= 4:
        risk += 30

    # Aadhaar not verified
    if row["Aadhaar_Verified"] != "TRUE":
        risk += 40

    # Suspicious inactive accounts
    if row["Account_Status"] != "ACTIVE":
        risk += 20

    # High payout schemes
    if row["Scheme_Amount"] >= 5000:
        risk += 10

    return min(risk, 100)


def analyze_dataframe(df):
    df = clean_data(df)

    if df.empty:
        return df, {
            "total_transactions": 0,
            "fraud_detected": 0,
            "avg_risk_score": 0.0,
            "ledger_integrity": 100,
        }

    df["Risk_Score"] = df.apply(calculate_risk, axis=1)

    fraud_cases = df[df["Risk_Score"] > 60]

    summary = {
        "total_transactions": len(df),
        "fraud_detected": len(fraud_cases),
        "avg_risk_score": round(df["Risk_Score"].mean(), 2),
        "ledger_integrity": 100 - int(len(fraud_cases) / len(df) * 100),
    }

    return df, summary
