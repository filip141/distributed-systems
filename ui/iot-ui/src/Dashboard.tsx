import { useEffect, useState } from "react"
import { getMeasurements, getLatest } from "./api"
import type { Measurement } from "./types"
import { MeasurementsTable } from "./components/MeasurementsTable"
import { LatestMeasurement } from "./components/LatestMeasurement"

export default function Dashboard() {
  const [data, setData] = useState<Measurement[]>([])
  const [latest, setLatest] = useState<Measurement | null>(null)

  useEffect(() => {
    getMeasurements().then(setData)
    getLatest().then(setLatest)
  }, [])

  if (!latest) return <p>Loading...</p>

  return (
    <div style={{ padding: 20 }}>
      <h1>IoT Dashboard</h1>

      <LatestMeasurement data={latest} />

      <MeasurementsTable data={data} />
    </div>
  )
}