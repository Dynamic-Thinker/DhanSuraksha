import pandas as pd


# --------------------------------------------------
# FRAUD SCORING ENGINE
# --------------------------------------------------
def compute_fraud_score(row):
    score = 0

    aadhaar_value = str(row.get("aadhaar_verified", "")).strip().upper()
    if aadhaar_value not in {"YES", "TRUE"}:
        score += 40

    if row.get("duplicate_flag"):
        score += 40

    amount = pd.to_numeric(row.get("amount", row.get("scheme_amount", 0)), errors="coerce")
    if pd.notna(amount) and float(amount) > 50000:
        score += 20

    return min(score, 100)


# --------------------------------------------------
# MAIN ANALYSIS FUNCTION
# --------------------------------------------------
def analyze_dataframe(df: pd.DataFrame):

    # ---------- DUPLICATE DETECTION ----------
    df["duplicate_flag"] = df.duplicated(subset=["citizen_id"], keep=False)

    # ---------- FRAUD SCORE ----------
    df["fraud_score"] = df.apply(compute_fraud_score, axis=1)

    # ---------- RISK LEVEL ----------
    def risk_label(score):
        if score >= 70:
            return "HIGH"
        elif score >= 40:
            return "MEDIUM"
        return "LOW"

    df["risk_level"] = df["fraud_score"].apply(risk_label)

    # ---------- SUMMARY ----------
    if df.empty:
        avg_fraud_score = 0.0
    else:
        avg_fraud_score = float(df["fraud_score"].mean())

    summary = {
        "total_records": int(len(df)),
        "duplicates": int(df["duplicate_flag"].sum()),
        "high_risk": int((df["risk_level"] == "HIGH").sum()),
        "medium_risk": int((df["risk_level"] == "MEDIUM").sum()),
        "low_risk": int((df["risk_level"] == "LOW").sum()),
        "avg_fraud_score": avg_fraud_score,
    }

    # ---------- RECENT TRANSACTIONS ----------
    transactions = df.tail(20).to_dict(orient="records")

    return df, {
        "summary": summary,
        "transactions": transactions,
    }
