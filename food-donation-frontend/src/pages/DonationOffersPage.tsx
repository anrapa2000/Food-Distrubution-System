import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface DonationOffer {
  id: string;
  donationId: string;
  donorId: string;
  donorName: string;
  quantity: number;
  description: string;
  location: string;
  distance: number;
  timestamp: string;
  status: "pending" | "accepted" | "declined";
  expiryTime: string;
}

interface NgoUser {
  ngoId: string;
  ngoName: string;
  location: string;
}

const DonationOffersPage = () => {
  const [ngoUser, setNgoUser] = useState<NgoUser | null>(null);
  const [offers, setOffers] = useState<DonationOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "declined">("all");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("ngoUser");
    if (!userData) {
      navigate("/ngo-login");
      return;
    }
    setNgoUser(JSON.parse(userData));
    loadOffers();
  }, [navigate]);

  const loadOffers = () => {
    // Simulate loading offers from API
    setTimeout(() => {
      const mockOffers: DonationOffer[] = [
        {
          id: "1",
          donationId: "donation-001",
          donorId: "d001",
          donorName: "John Smith",
          quantity: 10,
          description: "Fresh vegetables and fruits",
          location: "Koramangala, Bangalore",
          distance: 2.3,
          timestamp: new Date().toISOString(),
          status: "pending",
          expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now
        },
        {
          id: "2",
          donationId: "donation-002",
          donorId: "d002",
          donorName: "Sarah Johnson",
          quantity: 5,
          description: "Bread and bakery items",
          location: "Indiranagar, Bangalore",
          distance: 1.8,
          timestamp: new Date().toISOString(),
          status: "pending",
          expiryTime: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString() // 1.5 hours from now
        },
        {
          id: "3",
          donationId: "donation-003",
          donorId: "d003",
          donorName: "Mike Wilson",
          quantity: 15,
          description: "Canned goods and dry food",
          location: "HSR Layout, Bangalore",
          distance: 3.1,
          timestamp: new Date().toISOString(),
          status: "accepted",
          expiryTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: "4",
          donationId: "donation-004",
          donorId: "d004",
          donorName: "Lisa Brown",
          quantity: 8,
          description: "Dairy products",
          location: "JP Nagar, Bangalore",
          distance: 4.2,
          timestamp: new Date().toISOString(),
          status: "declined",
          expiryTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString()
        }
      ];
      setOffers(mockOffers);
      setLoading(false);
    }, 1000);
  };

  const handleAccept = async (offerId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOffers(offers.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: "accepted" as const }
          : offer
      ));
    } catch (error) {
      console.error("Failed to accept offer:", error);
    }
  };

  const handleDecline = async (offerId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOffers(offers.map(offer => 
        offer.id === offerId 
          ? { ...offer, status: "declined" as const }
          : offer
      ));
    } catch (error) {
      console.error("Failed to decline offer:", error);
    }
  };

  const getTimeRemaining = (expiryTime: string) => {
    const now = new Date();
    const expiry = new Date(expiryTime);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m remaining`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "#ff9800";
      case "accepted": return "#4caf50";
      case "declined": return "#f44336";
      default: return "#666";
    }
  };

  const filteredOffers = offers.filter(offer => 
    filter === "all" || offer.status === filter
  );

  if (!ngoUser) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <h2>Loading donation offers...</h2>
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
          <h1 style={{ margin: "0", color: "#333" }}>📦 Donation Offers</h1>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
            Manage incoming donation offers for {ngoUser.ngoName}
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

      {/* Filter Tabs */}
      <div style={{ 
        display: "flex", 
        gap: "0.5rem", 
        marginBottom: "2rem",
        flexWrap: "wrap"
      }}>
        {["all", "pending", "accepted", "declined"].map((status) => (
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
            {status} ({offers.filter(o => status === "all" || o.status === status).length})
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
        gap: "1rem" 
      }}>
        {filteredOffers.map((offer) => (
          <div key={offer.id} style={{
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
                  {offer.description}
                </h3>
                <p style={{ margin: "0", color: "#666", fontSize: "0.9rem" }}>
                  From: <strong>{offer.donorName}</strong> ({offer.donorId})
                </p>
              </div>
              <div style={{
                padding: "0.25rem 0.75rem",
                backgroundColor: getStatusColor(offer.status),
                color: "white",
                borderRadius: "12px",
                fontSize: "0.8rem",
                textTransform: "capitalize"
              }}>
                {offer.status}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                📦 <strong>Quantity:</strong> {offer.quantity} items
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                📍 <strong>Location:</strong> {offer.location}
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                🚗 <strong>Distance:</strong> {offer.distance} km away
              </p>
              <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                ⏰ <strong>Expires:</strong> {getTimeRemaining(offer.expiryTime)}
              </p>
            </div>

            {offer.status === "pending" && (
              <div style={{ 
                display: "flex", 
                gap: "0.5rem",
                marginTop: "1rem"
              }}>
                <button
                  onClick={() => handleAccept(offer.id)}
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
                  ✅ Accept
                </button>
                <button
                  onClick={() => handleDecline(offer.id)}
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
                  ❌ Decline
                </button>
              </div>
            )}

            {offer.status === "accepted" && (
              <div style={{
                padding: "0.75rem",
                backgroundColor: "#e8f5e8",
                color: "#2e7d32",
                borderRadius: "6px",
                fontSize: "0.9rem",
                textAlign: "center"
              }}>
                ✅ Offer accepted! Contact donor for pickup details.
              </div>
            )}

            {offer.status === "declined" && (
              <div style={{
                padding: "0.75rem",
                backgroundColor: "#ffebee",
                color: "#c62828",
                borderRadius: "6px",
                fontSize: "0.9rem",
                textAlign: "center"
              }}>
                ❌ Offer declined
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredOffers.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          color: "#666"
        }}>
          <h3>No {filter === "all" ? "" : filter} offers found</h3>
          <p>Check back later for new donation offers!</p>
        </div>
      )}
    </div>
  );
};

export default DonationOffersPage; 