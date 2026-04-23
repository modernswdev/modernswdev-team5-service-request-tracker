import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "../components/Card.jsx";
import Navbar from "../components/Navbar.jsx";
import colors from "../colors";

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRequest() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`http://127.0.0.1:8000/requests/${id}`);

        if (!response.ok) {
          throw new Error("Request not found.");
        }

        const data = await response.json();
        setRequest(data);
      } catch (err) {
        setError(err.message || "Failed to load request details.");
      } finally {
        setLoading(false);
      }
    }

    fetchRequest();
  }, [id]);

  const pageStyle = {
    padding: "2rem 2.5rem 2.5rem",
    backgroundColor: colors.lgBackground,
    minHeight: "100vh",
  };

  const detailCardStyle = {
    backgroundColor: colors.surface,
    borderRadius: "1.25rem",
    border: `1px solid ${colors.border}`,
    overflow: "hidden",
    maxWidth: "950px",
  };

  const headerStyle = {
    padding: "1.5rem 1.75rem 1rem",
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.surface,
  };

  const bodyStyle = {
    padding: "1.75rem",
    display: "grid",
    gap: "1.25rem",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "1rem 1.5rem",
  };

  const fieldStyle = {
    display: "grid",
    gap: "0.45rem",
  };

  const labelStyle = {
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: colors.textMuted,
  };

  const valueBoxStyle = {
    padding: "0.95rem 1rem",
    borderRadius: "12px",
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.lgBackground,
    color: colors.textMain,
    fontSize: "0.95rem",
    minHeight: "24px",
  };

  const priorityPillStyle = (priority) => {
    const map = {
      High: { color: colors.red, bg: colors.redBg },
      Medium: { color: colors.yellow, bg: colors.yellowBg },
      Low: { color: colors.green, bg: colors.greenBg },
    };

    const pill = map[priority] || map.Medium;

    return {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      padding: "0.35rem 0.85rem",
      borderRadius: "999px",
      fontSize: "0.8rem",
      fontWeight: 700,
      color: pill.color,
      backgroundColor: pill.bg,
      width: "fit-content",
    };
  };

  const statusPillStyle = (status) => {
    const map = {
      Open: { color: colors.blue, bg: colors.blueBg },
      "In Progress": { color: colors.yellow, bg: colors.yellowBg },
      Closed: { color: colors.green, bg: colors.greenBg },
    };

    const pill = map[status] || map.Open;

    return {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.4rem",
      padding: "0.35rem 0.85rem",
      borderRadius: "999px",
      fontSize: "0.8rem",
      fontWeight: 700,
      color: pill.color,
      backgroundColor: pill.bg,
      width: "fit-content",
    };
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
            Request Details
          </h2>
          <p
            style={{
              marginTop: "0.5rem",
              marginBottom: 0,
              color: colors.textMuted,
              fontSize: "0.95rem",
            }}
          >
            View details for the selected service request.
          </p>
        </div>

        <section style={detailCardStyle}>
          <div style={headerStyle}>
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
              Request #{id}
            </span>
          </div>

          <div style={bodyStyle}>
            {loading && (
              <p style={{ color: colors.textMuted, margin: 0 }}>
                Loading request details...
              </p>
            )}

            {error && (
              <p style={{ color: colors.red, margin: 0, fontWeight: 600 }}>
                {error}
              </p>
            )}

            {!loading && !error && request && (
              <>
                <div style={gridStyle}>
                  <div style={fieldStyle}>
                    <span style={labelStyle}>Request ID</span>
                    <div style={valueBoxStyle}>{request.id ?? "--"}</div>
                  </div>

                  <div style={fieldStyle}>
                    <span style={labelStyle}>Submitted By</span>
                    <div style={valueBoxStyle}>{request.user ?? "--"}</div>
                  </div>

                  <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                    <span style={labelStyle}>Title</span>
                    <div style={valueBoxStyle}>{request.title ?? "--"}</div>
                  </div>

                  <div style={{ ...fieldStyle, gridColumn: "1 / -1" }}>
                    <span style={labelStyle}>Description</span>
                    <div style={{ ...valueBoxStyle, minHeight: "120px" }}>
                      {request.description ?? "--"}
                    </div>
                  </div>

                  <div style={fieldStyle}>
                    <span style={labelStyle}>Created Date</span>
                    <div style={valueBoxStyle}>{request.created_at ?? "--"}</div>
                  </div>

                  <div style={fieldStyle}>
                    <span style={labelStyle}>Priority</span>
                    <div style={{ ...valueBoxStyle, display: "flex", alignItems: "center" }}>
                      <span style={priorityPillStyle(request.priority)}>
                        <span
                          style={{
                            width: "0.45rem",
                            height: "0.45rem",
                            borderRadius: "999px",
                            backgroundColor: "currentColor",
                          }}
                        />
                        {request.priority ?? "Medium"}
                      </span>
                    </div>
                  </div>

                  <div style={fieldStyle}>
                    <span style={labelStyle}>Status</span>
                    <div style={{ ...valueBoxStyle, display: "flex", alignItems: "center" }}>
                      <span style={statusPillStyle(request.status)}>
                        {request.status ?? "Open"}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => navigate("/home")}
                    style={{
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
                    }}
                  >
                    Back to Dashboard
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </Card>
  );
}