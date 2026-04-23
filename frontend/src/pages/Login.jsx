import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card.jsx";
import colors from "../colors";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed.");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card size="narrow">
      <div style={{ padding: "2rem 2.5rem" }}>
        <section style={{ maxWidth: "480px", margin: "0 auto" }}>
          <h2 style={{ marginBottom: "1rem", color: colors.textMain }}>
            Service Tracker Login
          </h2>

          <form
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
          >
            <label style={{ fontSize: "0.9rem", color: colors.textMain }}>
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: "0.25rem",
                  padding: "0.5rem 0.6rem",
                  borderRadius: "0.45rem",
                  border: `1px solid ${colors.border}`,
                }}
              />
            </label>

            <label style={{ fontSize: "0.9rem", color: colors.textMain }}>
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: "0.25rem",
                  padding: "0.5rem 0.6rem",
                  borderRadius: "0.45rem",
                  border: `1px solid ${colors.border}`,
                }}
              />
            </label>

            {error && (
              <p style={{ color: colors.red, margin: 0 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "0.5rem",
                padding: "0.6rem 1.4rem",
                borderRadius: "999px",
                border: "none",
                backgroundColor: colors.primary,
                color: colors.surface,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </section>
      </div>
    </Card>
  );
}