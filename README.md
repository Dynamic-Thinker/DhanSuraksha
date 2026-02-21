# DhanSuraksha

DhanSuraksha is a welfare-integrity monitoring platform with:
- **Backend**: FastAPI service for dataset ingestion, fraud scoring, and API access.
- **Frontend**: Next.js dashboard for login, mode selection, upload, and monitoring workflows.

## Core workflow
1. Open the app and sign in.
2. Choose **Demo** mode (auto-generated sample data) or **Live** mode.
3. In **Live** mode, upload an Excel dataset from `/dashboard/upload`.
4. Review dashboard metrics, recent transactions, fraud intel, ledger explorer, and threat monitor.

## Dataset format (live mode)
The backend normalizes common column aliases. Required logical fields are:
- `citizen_id` (or `Citizen_ID` / `citizen id`)
- `aadhaar_verified` (or `Aadhaar_Linked` / `aadhaar status`)
- `claim_count`
- `account_status`
- `scheme_amount`

## Local development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Set optional env var to point frontend to backend:
```bash
# frontend/.env.local
NEXT_PUBLIC_API=http://127.0.0.1:8000
```

## Production checks
```bash
python -m py_compile backend/main.py backend/fraud_engine.py backend/services/cleaner.py backend/services/analyzer.py
cd frontend && npx tsc --noEmit
cd frontend && npm run build
```

## Notes for future updates
- API URL is centralized in `frontend/lib/config.ts`.
- Backend claim → UI transaction mapping is centralized in `frontend/lib/api.ts` (`mapBackendClaimToTransaction`).
- Column aliasing and risk rules are centralized in `backend/main.py`.
