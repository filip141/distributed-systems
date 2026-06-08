import type { Measurement } from "../types"

export function MeasurementsTable({
  data,
}: {
  data: Measurement[]
}) {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover table-bordered align-middle">
        
        <thead className="table-dark">
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
              <td>
                <span
                  className={
                    m.sensor === "temperature"
                      ? "badge bg-danger"
                      : "badge bg-primary"
                  }
                >
                  {m.sensor}
                </span>
              </td>
              <td>
                <strong>
                  {m.value} {m.unit}
                </strong>
              </td>
              <td>
                {new Date(m.ts_ms).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  )
}