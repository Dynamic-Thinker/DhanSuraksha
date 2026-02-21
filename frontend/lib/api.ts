const API = process.env.NEXT_PUBLIC_API || "http://127.0.0.1:8000";

export async function uploadDataset(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${API}/upload`, {
    method: "POST",
    body: formData,
  })

  return res.json()
}

export async function getDashboardMetrics() {
  const res = await fetch(`${API}/dashboard`)
  return res.json()
}

export async function getClaims() {
  const res = await fetch(`${API}/claims`)
  return res.json()
}

export async function getFraudAlerts() {
  const res = await fetch(`${API}/fraud-alerts`)
  return res.json()
}

export async function simulateAttack() {
  const res = await fetch(`${API}/simulate-attack`)
  return res.json()
}