import { useEffect, useState } from "react"

import { getMeasurements, getLatest } from "./api"
import type { Measurement } from "./types"

import { MeasurementsTable } from "./components/MeasurementsTable"
import { MeasurementsCharts } from "./components/MeasurementsCharts"
import { FilterPanel } from "./components/FilterPanel"
import { LatestMeasurement } from "./components/LatestMeasurement"

export default function Dashboard() {
  const [data, setData] = useState<Measurement[]>([])
  const [latest, setLatest] = useState<Measurement | null>(null)

  const [view, setView] = useState<"table" | "charts">("table")
  const [sensor, setSensor] = useState<"all" | "temperature" | "preassure">("all")

  useEffect(() => {
    getMeasurements().then(setData)
    getLatest().then(setLatest)
  }, [])

  if (!latest) return <p>Loading...</p>

  const filtered =
    sensor === "all"
      ? data
      : data.filter((m) => m.sensor === sensor)

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">IoT Dashboard</h1>

      <LatestMeasurement data={latest} />

      <div className="mt-4">
        <FilterPanel
          view={view}
          sensor={sensor}
          onViewChange={setView}
          onSensorChange={setSensor}
        />
      </div>

      <div className="mt-4 bg-white rounded-xl shadow p-4 min-h-[700px]">
        {view === "table" ? (
          <MeasurementsTable data={filtered} />
        ) : (
          <MeasurementsCharts data={filtered} />
        )}
      </div>
    </div>
  )
}