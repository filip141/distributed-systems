type Props = {
  view: "table" | "charts"
  sensor: "all" | "temperature" | "preassure"
  onViewChange: (v: "table" | "charts") => void
  onSensorChange: (v: "all" | "temperature" | "preassure") => void
}

export function FilterPanel({
  view,
  sensor,
  onViewChange,
  onSensorChange,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">

      {/* VIEW */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewChange("table")}
          className={`px-5 py-2 rounded-lg font-medium ${
            view === "table"
              ? "bg-blue-600 text-white"
              : "bg-gray-100"
          }`}
        >
          📋 Table
        </button>

        <button
          onClick={() => onViewChange("charts")}
          className={`px-5 py-2 rounded-lg font-medium ${
            view === "charts"
              ? "bg-blue-600 text-white"
              : "bg-gray-100"
          }`}
        >
          📈 Charts
        </button>
      </div>

      {/* SENSOR */}
      <div className="flex gap-2 flex-wrap">
        {["all", "temperature", "preassure"].map((s) => (
          <button
            key={s}
            onClick={() => onSensorChange(s as any)}
            className={`px-4 py-1 rounded-full text-sm font-medium ${
              sensor === s
                ? "bg-black text-white"
                : "bg-gray-100"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}