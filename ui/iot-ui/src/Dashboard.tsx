import { useEffect, useState } from "react"
import { Logo } from "./components/Logo"
import { getMeasurements, getLatest } from "./api"
import type { Measurement } from "./types"

import { MeasurementsTable } from "./components/MeasurementsTable"
import { MeasurementsCharts } from "./components/MeasurementsCharts"
import { FilterPanel } from "./components/FilterPanel"
import { LatestMeasurement } from "./components/LatestMeasurement"

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [data, setData] = useState<Measurement[]>([])
  const [latest, setLatest] = useState<Measurement | null>(null)

  const [view, setView] = useState<"table" | "charts">("table")
  const [sensor, setSensor] = useState<"all" | "temperature" | "pressure">("all")

  useEffect(() => {
    getMeasurements().then(setData)
    getLatest().then(setLatest)
  }, [])

  if (!latest) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <p className="text-white fs-5">⏳ Loading dashboard...</p>
      </div>
    )
  }

  const filtered =
    sensor === "all"
      ? data
      : data.filter((m) => m.sensor === sensor)

  return (
    <div className="container-fluid min-vh-100 p-4 app-bg">
      <div className="row mb-4">
        <div className="col">
          <div className="glass-card p-3 d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <Logo />

              <h2 className="text-white m-0 fw-bold">
                FluxSense Control Center
              </h2>
            </div>

            <button
              className="btn btn-outline-light px-4 py-2"
              onClick={onLogout}
            >
              🚪 Logout
            </button>

          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <div className="glass-card p-4 latest-card">

            <h5 className="text-white mb-3">
              ⚡ Latest measurement
            </h5>

            <LatestMeasurement data={latest} />
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <div className="glass-card p-4">

            <h5 className="text-white mb-3">
              🎛 Controls
            </h5>

            <FilterPanel
              view={view}
              sensor={sensor}
              onViewChange={setView}
              onSensorChange={setSensor}
            />

          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="glass-card p-4" style={{ minHeight: "700px" }}>

            <h5 className="text-white mb-3">
              📈 Data visualization
            </h5>

            {view === "table" ? (
              <MeasurementsTable data={filtered} />
            ) : (
              <MeasurementsCharts data={filtered} />
            )}

          </div>
        </div>
      </div>

    </div>
  )
}