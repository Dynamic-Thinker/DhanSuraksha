import pandas as pd


# --------------------------------------------------
# FRAUD SCORING ENGINE
# --------------------------------------------------
def compute_fraud_score(row):
    score = 0

    if row.get("aadhaar_verified") != "YES":
        score += 40

    if row.get("duplicate_flag"):
        score += 40

    amount = row.get("amount", 0)
    if amount > 50000:
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
    summary = {
        "total_records": int(len(df)),
        "duplicates": int(df["duplicate_flag"].sum()),
        "high_risk": int((df["risk_level"] == "HIGH").sum()),
        "medium_risk": int((df["risk_level"] == "MEDIUM").sum()),
        "low_risk": int((df["risk_level"] == "LOW").sum()),
        "avg_fraud_score": float(df["fraud_score"].mean()),
    }

    # ---------- RECENT TRANSACTIONS ----------
    transactions = df.tail(20).to_dict(orient="records")

    return df, {
        "summary": summary,
        "transactions": transactions,
    }
