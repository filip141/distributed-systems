import type { Measurement } from "./types"

const API = "http://localhost:5001/api"

function logout() {
  localStorage.removeItem("access")
  localStorage.removeItem("refresh")
  window.location.href = "/"
}

function getToken() {
  return localStorage.getItem("access")
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()

  const res = await fetch(`${API}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  if (res.status === 401) {
    logout()
    throw new Error("Unauthorized - redirecting to login")
  }
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }

  return res.json()
}

export const getMeasurements = () =>
  apiFetch<Measurement[]>("/measurements/")

export const getLatest = () =>
  apiFetch<Measurement>("/measurements/latest/")