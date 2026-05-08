import type { Measurement } from "../types"

export function MeasurementsTable({ data }: { data: Measurement[] }) {
  return (
    <table border={1} cellPadding={8} style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Device</th>
          <th>Sensor</th>
          <th>Value</th>
          <th>Time</th>
        </tr>
      </thead>

      <tbody>
        {data.map((m) => (
          <tr key={m.id}>
            <td>{m.id}</td>
            <td>{m.device_id}</td>
            <td>{m.sensor}</td>
            <td>
              {m.value} {m.unit}
            </td>
            <td>{new Date(m.ts_ms).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}