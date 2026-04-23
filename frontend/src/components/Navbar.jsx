import { Link, useNavigate } from "react-router-dom";
import colors from "../colors";
import homeIcon from "../assets/white-home.svg";
import userIcon from "../assets/Sample_User_Icon.svg";
import logoutIcon from "../assets/logout-14.svg";

const iconStyle = {
  width: "16px",
  height: "16px",
  display: "block",
};

function DashboardIcon() {
  return <img src={homeIcon} alt="" aria-hidden="true" style={iconStyle} />;
}

function UserIcon() {
  return <img src={userIcon} alt="" aria-hidden="true" style={iconStyle} />;
}

function LogoutIcon() {
  return <img src={logoutIcon} alt="" aria-hidden="true" style={iconStyle} />;
}

export default function Navbar({ userName = "Admin" }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/");
  }

  const navStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1.5rem",
    padding: "0.85rem 1.75rem",
    backgroundColor: colors.surface,
    borderBottom: `1px solid ${colors.border}`,
  };

  const titleStyle = {
    fontSize: "1.05rem",
    fontWeight: 700,
    letterSpacing: "0.2px",
    color: colors.textMain,
    textDecoration: "none",
  };

  const navLinksStyle = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  };

  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    padding: "0.45rem 0.9rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    letterSpacing: "0.1px",
    color: colors.textMuted,
    backgroundColor: "transparent",
    textDecoration: "none",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  };

  return (
    <header style={navStyle}>
      <Link to="/home" style={titleStyle} aria-label="Service Request Tracker">
        Service Request Tracker
      </Link>

      <nav style={navLinksStyle}>
        <Link to="/home" style={base}>
          <DashboardIcon />
          Dashboard
        </Link>

        <Link to="/create" style={base}>
          Create Request
        </Link>

        <div style={base}>
          <UserIcon />
          {userName}
        </div>

        <button onClick={handleLogout} style={base}>
          <LogoutIcon />
          Logout
        </button>
      </nav>
    </header>
  );
}