import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card.jsx";
import Navbar from "../components/Navbar.jsx";
import colors from "../colors";

export default function CreateRequest() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !description.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create request.");
      }

      setSuccess("Request created successfully.");
      setTitle("");
      setDescription("");
      setPriority("Low");

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to create request.");
    }
  }

  const pageStyle = {
    padding: "2rem 2.5rem 2.5rem",
    backgroundColor: colors.lgBackground,
    minHeight: "100vh",
  };

  const formCardStyle = {
    backgroundColor: colors.surface,
    borderRadius: "1.25rem",
    border: `1px solid ${colors.border}`,
    overflow: "hidden",
    maxWidth: "900px",
  };

  const formHeaderStyle = {
    padding: "1.5rem 1.75rem 1rem",
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.surface,
  };

  const formBodyStyle = {
    padding: "1.75rem",
    display: "grid",
    gap: "1.4rem",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.textMuted,
    marginBottom: "0.55rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.9rem 1rem",
    borderRadius: "12px",
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.lgBackground,
    color: colors.textMain,
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "140px",
    resize: "vertical",
    fontFamily: "inherit",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
  };

  const submitStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blue,
    color: "white",
    border: "none",
    padding: "0.85rem 1.35rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "0.95rem",
  };

  const messageStyle = {
    fontSize: "0.9rem",
    fontWeight: 600,
  };

  return (
    <Card>
      <Navbar />
      <div style={pageStyle}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h2
            style={{
              fontSize: "1.9rem",
              fontWeight: 700,
              color: colors.textMain,
              margin: 0,
            }}
          >
            Create Request
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              marginBottom: 0,
              color: colors.textMuted,
              fontSize: "0.95rem",
            }}
          >
            Submit a new service request by filling out the form below.
          </p>
        </div>

        <section style={formCardStyle}>
          <div style={formHeaderStyle}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                fontSize: "0.8rem",
                fontWeight: 700,
                backgroundColor: colors.blueBg,
                color: colors.blue,
              }}
            >
              New Request
            </span>
          </div>

          <form onSubmit={handleSubmit} style={formBodyStyle}>
            <div>
              <label style={labelStyle}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter request title"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue or request"
                style={textareaStyle}
              />
            </div>

            <div style={{ maxWidth: "260px" }}>
              <label style={labelStyle}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={selectStyle}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {error && (
              <p style={{ ...messageStyle, color: colors.red, margin: 0 }}>
                {error}
              </p>
            )}

            {success && (
              <p style={{ ...messageStyle, color: colors.green, margin: 0 }}>
                {success}
              </p>
            )}

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.25rem" }}>
              <button type="submit" style={submitStyle}>
                Submit Request
              </button>

              <button
                type="button"
                onClick={() => navigate("/home")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "transparent",
                  color: colors.textMain,
                  border: `1px solid ${colors.border}`,
                  padding: "0.85rem 1.35rem",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    </Card>
  );
}