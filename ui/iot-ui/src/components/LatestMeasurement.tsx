// components/LatestMeasurement.tsx
import type { Measurement } from "../types"

export function LatestMeasurement({ data }: { data: Measurement }) {
  return (
    <div style={{ padding: 12, border: "1px solid black", marginBottom: 20 }}>
      <h3>Latest measurement</h3>
      <p>
        <b>{data.device_id}</b> / {data.sensor}
      </p>
      <p>
        Value: {data.value} {data.unit}
      </p>
      <small>{new Date(data.ts_ms).toLocaleString()}</small>
    </div>
  )
}