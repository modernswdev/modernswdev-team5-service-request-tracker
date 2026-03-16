import colors from "../colors";

export default function Card({ children, size = "wide" }) {
  const isNarrow = size === "narrow";

  const cardStyle = {
    width: isNarrow ? "auto" : "100%",
    //maxWidth: isNarrow ? "700px" : "1200px",
    minWidth: isNarrow ? "360px" : "auto",
    flexShrink: 0,
    backgroundColor: colors.surface,
    borderRadius: "1.25rem",
    padding: 0,
    overflow: "hidden",
    border: `1px solid ${colors.border}`,
    transition: "max-width 0.3s ease",
  };

  return <div style={cardStyle}>{children}</div>;
}
