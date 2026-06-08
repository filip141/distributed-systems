import type { Measurement } from "../types"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"

export function MeasurementsCharts({
  data,
}: {
  data: Measurement[]
}) {
  const temperature = data.filter(
    (m) => m.sensor === "temperature"
  )

  const pressure = data.filter(
    (m) => m.sensor === "preassure"
  )

  return (
    <div className="space-y-10">

      {/* TEMPERATURE */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="mb-3 font-semibold">
          Temperature
        </h3>

        {/* IMPORTANT: fixed height container */}
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={temperature}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="ts_ms"
                tickFormatter={(v) =>
                  new Date(v).toLocaleTimeString()
                }
              />

              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#ef4444"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PRESSURE */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="mb-3 font-semibold">
          Pressure
        </h3>

        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pressure}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="ts_ms"
                tickFormatter={(v) =>
                  new Date(v).toLocaleTimeString()
                }
              />

              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}