import type { Measurement } from "./types"

const API = "http://localhost:5001/api"

export async function getMeasurements(): Promise<Measurement[]> {
  const res = await fetch(`${API}/measurements/`)
  if (!res.ok) throw new Error("Error fetching measurements")
  return res.json()
}

export async function getLatest(): Promise<Measurement> {
  const res = await fetch(`${API}/measurements/latest/`)
  if (!res.ok) throw new Error("Error fetching latest")
  return res.json()
}