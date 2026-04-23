import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Card from "../components/Card.jsx"
import Navbar from "../components/Navbar.jsx"
import { apiFetch } from "../lib/api.js"
import colors from "../colors"

const priorityColors = {
  High: {
    color: colors.red,
    bg: colors.redBg,
  },
  Medium: {
    color: colors.yellow,
    bg: colors.yellowBg,
  },
  Low: {
    color: colors.green,
    bg: colors.greenBg,
  },
}

const statusPills = {
  Open: {
    color: colors.blue,
    bg: colors.blueBg,
  },
  "In Progress": {
    color: colors.yellow,
    bg: colors.yellowBg,
  },
  Closed: {
    color: colors.green,
    bg: colors.greenBg,
  },
}

function normalizeStatus(value) {
  if (!value) return "Open"
  const normalized = value.toLowerCase()
  if (normalized === "in progress") return "In Progress"
  if (normalized === "closed") return "Closed"
  return "Open"
}

function normalizePriority(value) {
  if (!value) return "Medium"
  const normalized = value.toLowerCase()
  if (normalized === "high") return "High"
  if (normalized === "low") return "Low"
  return "Medium"
}

export default function RequestDetails() {
  const { id } = useParams()
  const [request, setRequest] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let isMounted = true
    apiFetch(`/requests/${id}`)
      .then((data) => {
        if (isMounted) {
          setRequest(data)
          setError("")
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Unable to load request")
        }
      })
    return () => {
      isMounted = false
    }
  }, [id])

  const updateStatus = async (newStatus) => {
    try {
      const response = await apiFetch(`/requests/${id}/status`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({new_status: newStatus}),
      })
      setRequest(response.request)
      setError("")
    } catch (err) {
      setError(err.message || 'Failed to update status')
    }
  }

  const getStatusButtons = () => {
    const allStatuses = ['Open', 'In Progress', 'Closed']
    return allStatuses.filter(s => s !== status)
  }

  const status = normalizeStatus(request?.status)
  const priority = normalizePriority(request?.priority)

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
    letterSpacing: "0.08em",
    color: colors.textMuted,
    marginBottom: "0.35rem",
  }

  const valueStyle = {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: colors.textMain,
  }

  const pillStyle = (map, key) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.3rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    backgroundColor: map[key].bg,
    color: map[key].color,
  })

  return (
    <Card>
      <Navbar />
      {error && (
        <div style={{
          padding: "1rem",
          backgroundColor: colors.redBg,
          color: colors.red,
          border: `1px solid ${colors.red}`,
          borderRadius: "0.5rem",
          margin: "1rem 2.5rem"
        }}>
          {error}
        </div>
      )}
      <div style={{padding: "2rem 2.5rem 2.5rem", backgroundColor: colors.lgBackground}}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem"}}>
          <div>
            <p style={{fontSize: "0.8rem", color: colors.textMuted, marginBottom: "0.35rem"}}>
              <Link to="/home" style={{ color: colors.textMuted }}>Back to dashboard</Link>
            </p>
            <h2 style={{fontSize: "1.6rem", fontWeight: 700, color: colors.textMain}}>
              {request?.title ?? "Request Details"}
            </h2>
            <p style={{color: colors.textMuted, marginTop: "0.3rem"}}>
              {request?.id ? `Request ID: ${request.id}` : "Ticket ID pending"}
            </p>
          </div>
          <div style={{display: "flex", gap: "0.6rem", flexWrap: "wrap", justifyContent: "flex-end"}}>
            <span style={pillStyle(statusPills, status)}>
              <span style={{ width: "0.45rem", height: "0.45rem", borderRadius: "999px", backgroundColor: "currentColor"}} />
              {status}
            </span>
            <span style={pillStyle(priorityColors, priority)}>
              <span style={{width: "0.45rem", height: "0.45rem", borderRadius: "999px", backgroundColor: "currentColor"}} />
              {priority}
            </span>
          </div>
        </div>

        {request && (
          <div style={{marginTop: "1.5rem", display: "grid", gap: "1.5rem"}}>
            <section style={sectionStyle}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: colors.textMain}}>
                Summary
              </h3>
              <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem"}}>
                <div>
                  <div style={labelStyle}>Submitted By</div>
                  <div style={valueStyle}>{request.user ?? "Unassigned"}</div>
                </div>
                <div>
                  <div style={labelStyle}>Created Date</div>
                  <div style={valueStyle}>{request.created_at ?? "Not available"}</div>
                </div>
                <div>
                  <div style={labelStyle}>Current Status</div>
                  <div style={valueStyle}>{status}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {getStatusButtons().map(newStatus => (
                      <button
                        key={newStatus}
                        onClick={() => updateStatus(newStatus)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          border: `1px solid ${colors.border}`,
                          borderRadius: '0.25rem',
                          backgroundColor: colors.surface,
                          color: colors.textMain,
                          cursor: 'pointer',
                        }}
                      >
                        Mark as {newStatus}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={labelStyle}>Priority</div>
                  <div style={valueStyle}>{priority}</div>
                </div>
              </div>
            </section>

            <section style={sectionStyle}>
              <h3 style={{fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", color: colors.textMain}}> Description </h3>
              <p style={{color: colors.textMuted, lineHeight: 1.6 }}> {request.description}</p>
            </section>
          </div>
        )}
      </div>
    </Card>
  )
}
