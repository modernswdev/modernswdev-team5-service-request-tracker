import { useNavigate } from "react-router-dom";
import Card from "../components/Card.jsx";
import colors from "../colors";

export default function Login() {
  const navigate = useNavigate();

  //take anything for now. will add actual authentication logic later
  const handleFakeLogin = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <Card size="narrow">
      <div style={{padding: "2rem 2.5rem"}}>
        <section style={{maxWidth: "480px", margin: "0 auto"}}>
          <h2 style={{marginBottom: "1rem", color: colors.textMain}}>
            Service Tracker Login
          </h2>
          <form onSubmit={handleFakeLogin} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <label style={{fontSize: "0.9rem", color: colors.textMain}}>
              Email
              <input type="email" required style={{width: "100%",
                  marginTop: "0.25rem",
                  padding: "0.5rem 0.6rem",
                  borderRadius: "0.45rem",
                  border: `1px solid ${colors.border}`
                }}/>
            </label>

            <label style={{fontSize: "0.9rem", color: colors.textMain }}>
              Password
              <input type="password" required style={{
                  width: "100%",
                  marginTop: "0.25rem",
                  padding: "0.5rem 0.6rem",
                  borderRadius: "0.45rem",
                  border: `1px solid ${colors.border}`,
                }}/>
            </label>

            <button type="submit" style={{marginTop: "0.5rem",
                padding: "0.6rem 1.4rem",
                borderRadius: "999px",
                border: "none",
                backgroundColor: colors.primary,
                color: colors.surface,
                fontWeight: 600,
              }}> Login
            </button>
          </form>
        </section>
      </div>
    </Card>
  );
}
