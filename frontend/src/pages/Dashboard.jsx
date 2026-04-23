import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import Card from "../components/Card.jsx"
import Navbar from "../components/Navbar.jsx"
import dotsIcon from "../assets/dots.svg"
import colors from "../colors"
import { useNavigate } from "react-router-dom";

const status_order = ["Open", "In Progress", "Closed"]

function DotsIcon () {
  return (
    <img src={dotsIcon} alt="" style={{width: "16px", height: "16px", display: "block"}} />
  )
}
//normalize status strings. default = open status
function normalizeStatus(value) {
  if (!value) return "Open"
  const normalized = value.toLowerCase()
  if (normalized === "in progress") return "In Progress"
  if (normalized === "closed") return "Closed"
  return "Open"
}

//normalize priority strings. default = medium status
function normalizePriority(value) {
  if (!value) return "Medium"
  const normalized = value.toLowerCase()
  if (normalized === "high") return "High"
  if (normalized === "low") return "Low"
  return "Medium"
}

const priority_colors = {
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

const status_pills = {
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

export default function Dashboard() {
  const [requests, setRequests] = useState([])
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  useEffect(() => {
    fetch("http://localhost:8000/requests")
      .then((res) => res.json())
      .then((data) => setRequests(data))
  }, [])

  const filteredRequests = useMemo(() => {
    const q = query.trim().toLowerCase()
    return requests.filter((request) => {
      const status = normalizeStatus(request.status)
      if (statusFilter !== "All" && status !== statusFilter) return false
      if (!q) return true
      const haystack = [
        request.id,
        request.title,
        request.user,
        request.description,
        request.created_at,
      ].filter(Boolean).join(" ").toLowerCase()
      return haystack.includes(q)
    })
  }, [requests, query, statusFilter])

  const grouped = useMemo(() => {
    const buckets = {
      Open: [],
      "In Progress": [],
      Closed: [],
    }
    for (const request of filteredRequests) {
      const status = normalizeStatus(request.status)
      buckets[status].push(request)
    }
    return buckets
  }, [filteredRequests])

  const sectionStyle = {
    backgroundColor: colors.surface,
    borderRadius: "1rem",
    border: `1px solid ${colors.border}`,
    overflow: "hidden",
  }

  const sectionHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.85rem 1.25rem",
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.surface,
  }

  const headerCellStyle = {
    padding: "0.75rem 1.25rem",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.textMuted,
    textAlign: "left",
  }

  const bodyCellStyle = {
    padding: "0.85rem 1.25rem",
    borderBottom: `1px solid ${colors.border}`,
    fontSize: "0.9rem",
    color: colors.textMain,
  }

  const mutedCellStyle = {
    ...bodyCellStyle,
    color: colors.textMuted,
  }

  const statusPillStyle = (status) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.3rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    backgroundColor: status_pills[status].bg,
    color: status_pills[status].color,
  })

  const priorityPillStyle = (priority) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.25rem 0.7rem",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: priority_colors[priority].color,
    backgroundColor: priority_colors[priority].bg,
  })


  return (
    <Card>
      <Navbar />
      <div style={{padding: "2rem 2.5rem 2.5rem", backgroundColor: colors.lgBackground}}>
        <div>
          <h2 style={{fontSize: "1.6rem", fontWeight: 700, color: colors.textMain}}>Dashboard</h2>
      
        </div>

        <div style={{ display: "grid", gap: "1.5rem" }}>
          {status_order.map((status) => {
            const rows = grouped[status]
            return (
              <section key={status} style={sectionStyle}>
                <div style={sectionHeaderStyle}>
                  <span style={statusPillStyle(status)}> {status} ({rows.length}) </span>
                </div>
                <div style={{overflowX: "auto"}}>
                  <table style={{width: "100%", borderCollapse: "collapse"}}>
                    <thead style={{backgroundColor: colors.lgBackground}}>
                      <tr>
                        <th style={headerCellStyle}>ID</th>
                        <th style={headerCellStyle}>Title</th>
                        <th style={headerCellStyle}>Submitted By</th>
                        <th style={headerCellStyle}>Description</th>
                        <th style={headerCellStyle}>Created Date</th>
                        <th style={headerCellStyle}>Priority</th>
                        <th style={headerCellStyle}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length === 0 && (
                        <tr>
                          <td style={mutedCellStyle} colSpan={7}> No requests in this stage. </td>
                        </tr>
                      )}
                      {rows.map((request) => {
                        const priority = normalizePriority(request.priority)
                        return (
                          <tr key={request.id}>
                            <td style={{...bodyCellStyle, color: colors.textMuted}}>
                              <Link style={{color: colors.textMain, fontWeight: 600}} to={`/request/${request.id}`}>
                                {request.id}
                              </Link>
                            </td>
                            <td style={bodyCellStyle}> {request.title} </td>
                            <td style={mutedCellStyle}> {request.user ?? "--"} </td>
                            <td style={mutedCellStyle}> {request.description ?? "--"} </td>
                            <td style={mutedCellStyle}> {request.created_at ?? "--"} </td>
                            <td style={bodyCellStyle}>
                              <span style={priorityPillStyle(priority)}>
                                <span style={{width: "0.45rem", height: "0.45rem", borderRadius: "999px", backgroundColor: "currentColor"}} />
                                {priority}
                              </span>
                            </td>
                            <td style={{ textAlign: "right"}}> <DotsIcon /> </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
