import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NgoLoginPage = () => {
  const [credentials, setCredentials] = useState({
    ngoId: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login process
    setTimeout(() => {
      if (credentials.ngoId === "ngo001" && credentials.password === "password") {
        // Store NGO info in localStorage for demo
        localStorage.setItem("ngoUser", JSON.stringify({
          ngoId: credentials.ngoId,
          ngoName: "Helping Hands",
          location: "Bangalore"
        }));
        navigate("/ngo-dashboard");
      } else {
        setError("Invalid NGO ID or password");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "1rem"
    }}>
      <div style={{
        background: "white",
        padding: "2rem",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ 
            color: "#333", 
            marginBottom: "0.5rem",
            fontSize: "2rem"
          }}>
            🏥 NGO Login
          </h1>
          <p style={{ color: "#666", fontSize: "0.9rem" }}>
            Access your donation management dashboard
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#333",
              fontWeight: "500"
            }}>
              NGO ID
            </label>
            <input
              type="text"
              name="ngoId"
              value={credentials.ngoId}
              onChange={handleInputChange}
              placeholder="Enter your NGO ID"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label style={{
              display: "block",
              marginBottom: "0.5rem",
              color: "#333",
              fontWeight: "500"
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "1rem",
                boxSizing: "border-box"
              }}
              required
            />
          </div>

          {error && (
            <div style={{
              padding: "0.75rem",
              backgroundColor: "#fee",
              color: "#c33",
              borderRadius: "6px",
              marginBottom: "1rem",
              fontSize: "0.9rem"
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: isLoading ? "#ccc" : "#667eea",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s"
            }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ 
          marginTop: "2rem", 
          textAlign: "center",
          padding: "1rem",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px"
        }}>
          <h4 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>Demo Credentials</h4>
          <p style={{ margin: "0", fontSize: "0.9rem", color: "#666" }}>
            NGO ID: <strong>ngo001</strong><br />
            Password: <strong>password</strong>
          </p>
        </div>

        <div style={{ 
          marginTop: "1rem", 
          textAlign: "center" 
        }}>
          <a 
            href="/" 
            style={{ 
              color: "#667eea", 
              textDecoration: "none",
              fontSize: "0.9rem"
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default NgoLoginPage; 