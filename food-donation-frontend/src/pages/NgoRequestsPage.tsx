import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface MatchedDonation {
  id: string;
  donationId: string;
  donorId: string;
  donorName: string;
  donorPhone: string;
  quantity: number;
  description: string;
  location: string;
  distance: number;
  matchedAt: string;
  status: "pending" | "accepted" | "picked_up" | "completed" | "cancelled";
  pickupDate?: string;
  notes?: string;
  ngoId: string;
  ngoName: string;
}

interface NgoUser {
  ngoId: string;
  ngoName: string;
  location: string;
}

const NgoRequestsPage = () => {
  const [ngoUser, setNgoUser] = useState<NgoUser | null>(null);
  const [requests, setRequests] = useState<MatchedDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "picked_up" | "completed" | "cancelled">("all");
  const [selectedRequest, setSelectedRequest] = useState<MatchedDonation | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("ngoUser");
    if (!userData) {
      navigate("/ngo-login");
      return;
    }
    setNgoUser(JSON.parse(userData));
    loadRequests();
  }, [navigate]);

  const loadRequests = () => {
    // Simulate loading requests from API
    setTimeout(() => {
      const mockRequests: MatchedDonation[] = [
        {
          id: "1",
          donationId: "donation-001",
          donorId: "d001",
          donorName: "John Smith",
          donorPhone: "+91 98765 43210",
          quantity: 10,
          description: "Fresh vegetables and fruits",
          location: "Koramangala, Bangalore",
          distance: 2.3,
          matchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          status: "accepted",
          pickupDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          notes: "Pickup scheduled for tomorrow morning",
          ngoId: "ngo001",
          ngoName: "Helping Hands"
        },
        {
          id: "2",
          donationId: "donation-002",
          donorId: "d002",
          donorName: "Sarah Johnson",
          donorPhone: "+91 98765 43211",
          quantity: 5,
          description: "Bread and bakery items",
          location: "Indiranagar, Bangalore",
          distance: 1.8,
          matchedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          status: "pending",
          ngoId: "ngo001",
          ngoName: "Helping Hands"
        },
        {
          id: "3",
          donationId: "donation-003",
          donorId: "d003",
          donorName: "Mike Wilson",
          donorPhone: "+91 98765 43212",
          quantity: 15,
          description: "Canned goods and dry food",
          location: "HSR Layout, Bangalore",
          distance: 3.1,
          matchedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
          status: "picked_up",
          pickupDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          notes: "Successfully picked up. Items in good condition.",
          ngoId: "ngo001",
          ngoName: "Helping Hands"
        },
        {
          id: "4",
          donationId: "donation-004",
          donorId: "d004",
          donorName: "Lisa Brown",
          donorPhone: "+91 98765 43213",
          quantity: 8,
          description: "Dairy products",
          location: "JP Nagar, Bangalore",
          distance: 4.2,
          matchedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          status: "completed",
          pickupDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          notes: "Donation distributed to beneficiaries",
          ngoId: "ngo001",
          ngoName: "Helping Hands"
        },
        {
          id: "5",
          donationId: "donation-005",
          donorId: "d005",
          donorName: "David Lee",
          donorPhone: "+91 98765 43214",
          quantity: 12,
          description: "Rice and pulses",
          location: "Whitefield, Bangalore",
          distance: 5.5,
          matchedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          status: "cancelled",
          notes: "Donor cancelled due to emergency",
          ngoId: "ngo001",
          ngoName: "Helping Hands"
        }
      ];
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  };

  const handleStatusUpdate = async (requestId: string, newStatus: MatchedDonation["status"]) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setRequests(requests.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus }
          : request
      ));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "#ff9800";
      case "accepted": return "#2196f3";
      case "picked_up": return "#9c27b0";
      case "completed": return "#4caf50";
      case "cancelled": return "#f44336";
      default: return "#666";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return "⏳";
      case "accepted": return "✅";
      case "picked_up": return "📦";
      case "completed": return "🎉";
      case "cancelled": return "❌";
      default: return "📋";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredRequests = requests.filter(request => 
    filter === "all" || request.status === filter
  );

  if (!ngoUser) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <h2>Loading your requests...</h2>
      </div>
    );
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
          <h1 style={{ margin: "0", color: "#333" }}>📋 My Requests</h1>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
            Track your matched donations and request history
          </p>
        </div>
        <button
          onClick={() => navigate("/ngo-dashboard")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Statistics */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        {["pending", "accepted", "picked_up", "completed", "cancelled"].map((status) => (
          <div key={status} style={{
            padding: "1rem",
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #ddd",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
              {getStatusIcon(status)}
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: getStatusColor(status) }}>
              {requests.filter(r => r.status === status).length}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#666", textTransform: "capitalize" }}>
              {status.replace("_", " ")}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ 
        display: "flex", 
        gap: "0.5rem", 
        marginBottom: "2rem",
        flexWrap: "wrap"
      }}>
        {["all", "pending", "accepted", "picked_up", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: filter === status ? "#667eea" : "#f0f0f0",
              color: filter === status ? "white" : "#333",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              textTransform: "capitalize"
            }}
          >
            {status.replace("_", " ")} ({requests.filter(r => status === "all" || r.status === status).length})
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", 
        gap: "1rem" 
      }}>
        {filteredRequests.map((request) => (
          <div key={request.id} style={{
            padding: "1.5rem",
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #ddd",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "flex-start",
              marginBottom: "1rem"
            }}>
              <div>
                <h3 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>
                  {request.description}
                </h3>
                <p style={{ margin: "0", color: "#666", fontSize: "0.9rem" }}>
                  From: <strong>{request.donorName}</strong> ({request.donorId})
                </p>
              </div>
              <div style={{
                padding: "0.25rem 0.75rem",
                backgroundColor: getStatusColor(request.status),
                color: "white",
                borderRadius: "12px",
                fontSize: "0.8rem",
                textTransform: "capitalize"
              }}>
                {request.status.replace("_", " ")}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                📦 <strong>Quantity:</strong> {request.quantity} items
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                📍 <strong>Location:</strong> {request.location}
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                🚗 <strong>Distance:</strong> {request.distance} km away
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                📞 <strong>Contact:</strong> {request.donorPhone}
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                📅 <strong>Matched:</strong> {formatDate(request.matchedAt)}
              </p>
              {request.pickupDate && (
                <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                  🚚 <strong>Pickup:</strong> {formatDate(request.pickupDate)}
                </p>
              )}
            </div>

            {request.notes && (
              <div style={{
                padding: "0.75rem",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                marginBottom: "1rem",
                fontSize: "0.9rem"
              }}>
                <strong>Notes:</strong> {request.notes}
              </div>
            )}

            {/* Action Buttons */}
            {request.status === "pending" && (
              <div style={{ 
                display: "flex", 
                gap: "0.5rem",
                marginTop: "1rem"
              }}>
                <button
                  onClick={() => handleStatusUpdate(request.id, "accepted")}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  ✅ Accept Request
                </button>
                <button
                  onClick={() => handleStatusUpdate(request.id, "cancelled")}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            )}

            {request.status === "accepted" && (
              <div style={{ 
                display: "flex", 
                gap: "0.5rem",
                marginTop: "1rem"
              }}>
                <button
                  onClick={() => handleStatusUpdate(request.id, "picked_up")}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "#9c27b0",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  📦 Mark as Picked Up
                </button>
              </div>
            )}

            {request.status === "picked_up" && (
              <div style={{ 
                display: "flex", 
                gap: "0.5rem",
                marginTop: "1rem"
              }}>
                <button
                  onClick={() => handleStatusUpdate(request.id, "completed")}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    backgroundColor: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  🎉 Mark as Completed
                </button>
              </div>
            )}

            {request.status === "completed" && (
              <div style={{
                padding: "0.75rem",
                backgroundColor: "#e8f5e8",
                color: "#2e7d32",
                borderRadius: "6px",
                fontSize: "0.9rem",
                textAlign: "center"
              }}>
                ✅ Request completed successfully!
              </div>
            )}

            {request.status === "cancelled" && (
              <div style={{
                padding: "0.75rem",
                backgroundColor: "#ffebee",
                color: "#c62828",
                borderRadius: "6px",
                fontSize: "0.9rem",
                textAlign: "center"
              }}>
                ❌ Request was cancelled
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          color: "#666"
        }}>
          <h3>No {filter === "all" ? "" : filter.replace("_", " ")} requests found</h3>
          <p>Your matched donations will appear here!</p>
        </div>
      )}
    </div>
  );
};

export default NgoRequestsPage; 