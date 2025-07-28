import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface NgoUser {
  ngoId: string;
  ngoName: string;
  location: string;
}

const NgoDashboardPage = () => {
  const [ngoUser, setNgoUser] = useState<NgoUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("ngoUser");
    if (!userData) {
      navigate("/ngo-login");
      return;
    }
    setNgoUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("ngoUser");
    navigate("/ngo-login");
  };

  if (!ngoUser) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "2rem",
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px"
      }}>
        <div>
          <h1 style={{ margin: "0", color: "#333" }}>🏥 NGO Dashboard</h1>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
            Welcome, {ngoUser.ngoName} ({ngoUser.ngoId})
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div style={{
          padding: "1.5rem",
          backgroundColor: "#e3f2fd",
          borderRadius: "8px",
          border: "1px solid #bbdefb"
        }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#1976d2" }}>📊 Statistics</h3>
          <p><strong>Total Donations Received:</strong> 15</p>
          <p><strong>This Month:</strong> 8</p>
          <p><strong>Pending Pickups:</strong> 3</p>
        </div>

        <div style={{
          padding: "1.5rem",
          backgroundColor: "#f3e5f5",
          borderRadius: "8px",
          border: "1px solid #e1bee7"
        }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#7b1fa2" }}>📍 Location</h3>
          <p><strong>Address:</strong> {ngoUser.location}</p>
          <p><strong>Coordinates:</strong> 12.933, 77.610</p>
          <p><strong>Service Area:</strong> 5km radius</p>
        </div>

        <div style={{
          padding: "1.5rem",
          backgroundColor: "#e8f5e8",
          borderRadius: "8px",
          border: "1px solid #c8e6c9"
        }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#388e3c" }}>⚡ Quick Actions</h3>
          <button 
            onClick={() => navigate("/donation-offers")}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "0.5rem",
              padding: "0.5rem",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            View Donation Offers
          </button>
          <button 
            onClick={() => navigate("/ngo-requests")}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "0.5rem",
              padding: "0.5rem",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            My Requests
          </button>
          <button style={{
            display: "block",
            width: "100%",
            padding: "0.5rem",
            backgroundColor: "#ff9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            Contact Support
          </button>
        </div>
      </div>

      <div style={{
        padding: "1.5rem",
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #ddd"
      }}>
        <h3 style={{ margin: "0 0 1rem 0" }}>📋 Recent Activity</h3>
        <div style={{ fontSize: "0.9rem" }}>
          <p>✅ <strong>Donation #1234</strong> received from Donor d001 (10 items)</p>
          <p>✅ <strong>Donation #1235</strong> received from Donor d002 (5 items)</p>
          <p>⏳ <strong>Donation #1236</strong> pending pickup from Donor d003</p>
          <p>✅ <strong>Donation #1237</strong> received from Donor d004 (15 items)</p>
        </div>
      </div>
    </div>
  );
};

export default NgoDashboardPage; 