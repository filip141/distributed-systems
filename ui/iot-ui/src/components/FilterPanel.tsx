type Props = {
  view: "table" | "charts"
  sensor: "all" | "temperature" | "pressure"
  onViewChange: (v: "table" | "charts") => void
  onSensorChange: (v: "all" | "temperature" | "pressure") => void
}

export function FilterPanel({
  view,
  sensor,
  onViewChange,
  onSensorChange,
}: Props) {
  return (
    <div className="p-3 rounded-4 bg-dark bg-opacity-25">

      {/* VIEW SWITCH (TA SAMA WYSOKOŚĆ + SZEROKOŚĆ CO DOŁ) */}
      <div className="d-flex flex-wrap gap-3 justify-content-center mb-3">

        <button
          onClick={() => onViewChange("table")}
          className={`btn rounded-pill sensor-big ${
            view === "table"
              ? "btn-danger"
              : "btn-outline-light"
          }`}
        >
          📋 Table
        </button>

        <button
          onClick={() => onViewChange("charts")}
          className={`btn rounded-pill sensor-big ${
            view === "charts"
              ? "btn-danger"
              : "btn-outline-light"
          }`}
        >
          📈 Charts
        </button>

      </div>

      {/* SENSOR FILTERS (bez zmian wizualnych) */}
      <div className="d-flex flex-wrap gap-3 justify-content-center">

        {[
          { key: "all", label: "All" },
          { key: "temperature", label: "Temperature" },
          { key: "pressure", label: "Pressure" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => onSensorChange(item.key as any)}
            className={`btn rounded-pill sensor-big ${
              sensor === item.key
                ? "btn-danger text-white"
                : "btn-outline-light"
            }`}
          >
            {item.label}
          </button>
        ))}

      </div>

    </div>
  )
}