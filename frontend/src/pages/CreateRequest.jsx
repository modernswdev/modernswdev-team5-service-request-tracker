import { useState } from "react"
import { Link } from "react-router-dom"
import Card from "../components/Card.jsx"
import Navbar from "../components/Navbar.jsx"
import colors from "../colors"
export default function CreateRequest() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [submittedBy, setSubmittedBy] = useState("")

  const sectionStyle = {
    backgroundColor: colors.surface,
    borderRadius: "1rem",
    border: `1px solid ${colors.border}`,
    padding: "1.25rem",
  }

  const labelStyle = {
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08rem",
    color: colors.textMuted,
    marginBottom: "0.4rem",
  }

  const inputStyle = {
    width: "100%",
    borderRadius: "0.75rem",
    border: `1px solid ${colors.border}`,
    padding: "0.65rem 0.9rem",
    fontSize: "0.95rem",
    fontWeight: 500,
    color: colors.textMain,
    backgroundColor: colors.surface,
    outline: "none",
  }

  const helperStyle = {
    fontSize: "0.78rem",
    color: colors.textMuted,
    marginTop: "0.35rem",
  }

  function handleSubmit(event) {
    event.preventDefault()
  }

  return (
    <Card>
      <Navbar />
      <div style={{padding: "2rem 2.5rem 2.5rem", backgroundColor: colors.lgBackground}}>
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap"}}>
          <div>
            <p style={{fontSize: "0.8rem", color: colors.textMuted, marginBottom: "0.35rem"}}>
              <Link to="/home" style={{ color: colors.textMuted }}>Back to dashboard</Link>
            </p>
            <h2 style={{fontSize: "1.6rem", fontWeight: 700, color: colors.textMain}}>Create Request</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem", display: "grid", gap: "1.5rem" }}>
          <section style={sectionStyle}>
            <h3 style={{fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: colors.textMain}}>Request Details</h3>
            <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem"}}>
              <div>
                <div style={labelStyle}>Submitted By</div>
                <input style={inputStyle} placeholder="Full name" value={submittedBy} onChange={(event) => setSubmittedBy(event.target.value)}/>
              </div>
              <div>
                <div style={labelStyle}>Priority</div>
                <select style={{...inputStyle, appearance: "none" }} value={priority} onChange={(event) => setPriority(event.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <div style={helperStyle}>Choose how urgent this request is.</div>
              </div>
            </div>

            <div style={{marginTop: "1rem"}}>
              <div style={labelStyle}>Title</div>
              <input style={inputStyle} placeholder="Short summary of the issue" value={title} onChange={(event) => setTitle(event.target.value)}/>
            </div>

            <div style={{marginTop: "1rem"}}>
              <div style={labelStyle}>Description</div>
              <textarea
                style={{...inputStyle, minHeight: "140px", resize: "vertical"}}
                placeholder="Describe the issue in more detail..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
            <div style={{display: "flex", flexWrap: "wrap", gap: "0.75rem", alignContent: "left", justifyContent: "flex-end", marginTop: "1.25rem"}}>
              <button
                type="submit"
                style={{
                  borderRadius: "0.85rem",
                  padding: "0.7rem 1.4rem",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: "white",
                  backgroundColor: colors.primary,
                }} 
                > Submit Request
              </button>
              <Link
                to="/home"
                style={{
                  borderRadius: "0.85rem",
                  padding: "0.7rem 1.4rem",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: colors.textMain,
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.surface,
                }}
              > Cancel
              </Link>
            </div>
          </section>
        </form>
      </div>
    </Card>
  )
}
