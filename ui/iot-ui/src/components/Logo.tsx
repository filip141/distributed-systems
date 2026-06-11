import logo from "../assets/tr-log.png"

export function Logo() {
  return (
    <img
      src={logo}
      alt="NeonPulse logo"
      style={{
        width: 80,
        height: 80,
        objectFit: "contain",
        filter: "drop-shadow(0 0 10px rgba(236,72,153,0.55))",
        transition: "0.2s ease",
      }}
    />
  )
}