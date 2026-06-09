import { useState } from "react"

const API = "http://localhost:5001/api"

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const res = await fetch(`${API}/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        setError("Invalid credentials")
        return
      }

      const data = await res.json()

      localStorage.setItem("access", data.access)
      localStorage.setItem("refresh", data.refresh)

      onLogin()
    } catch (err) {
      setError("Server error")
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#d946ef,#ec4899,#7c3aed)",
      }}
    >
      <div
        style={{
          width: "380px",
          padding: "28px",
          borderRadius: "18px",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "white",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "700",
          }}
        >
          IoT Dashboard
        </h2>

        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            opacity: 0.8,
            marginBottom: "20px",
          }}
        >
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              outline: "none",
            }}
          />

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              outline: "none",
            }}
          />

          {error && (
            <div
              style={{
                color: "#ffb4b4",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              fontWeight: "600",
              color: "white",
              cursor: "pointer",
              background: "linear-gradient(90deg,#d946ef,#ec4899)",
              marginTop: "6px",
            }}
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}