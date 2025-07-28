import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatTimestamp, formatFullDate, getTimeAgo } from "../utils/dateUtils";

interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  quantity: number;
  description: string;
  location: string;
  timestamp: string;
  status: "pending" | "matched" | "completed" | "expired";
}

interface Match {
  id: string;
  donationId: string;
  donorId: string;
  donorName: string;
  ngoId: string;
  ngoName: string;
  quantity: number;
  matchedAt: string;
  status: "pending" | "accepted" | "picked_up" | "completed" | "cancelled";
}

interface DonorStats {
  donorId: string;
  donorName: string;
  totalDonations: number;
  totalQuantity: number;
}

interface NgoStats {
  ngoId: string;
  ngoName: string;
  totalMatches: number;
  totalQuantity: number;
}

const AdminDashboardPage = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"donations" | "matches">("donations");
  const [sortBy, setSortBy] = useState<string>("timestamp");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterDonor, setFilterDonor] = useState("");
  const [filterNgo, setFilterNgo] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Simulate loading data from API
    setTimeout(() => {
      const mockDonations: Donation[] = [
        {
          id: "donation-001",
          donorId: "d001",
          donorName: "John Smith",
          quantity: 10,
          description: "Fresh vegetables and fruits",
          location: "Koramangala, Bangalore",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "matched"
        },
        {
          id: "donation-002",
          donorId: "d002",
          donorName: "Sarah Johnson",
          quantity: 5,
          description: "Bread and bakery items",
          location: "Indiranagar, Bangalore",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          status: "pending"
        },
        {
          id: "donation-003",
          donorId: "d003",
          donorName: "Mike Wilson",
          quantity: 15,
          description: "Canned goods and dry food",
          location: "HSR Layout, Bangalore",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          status: "completed"
        },
        {
          id: "donation-004",
          donorId: "d004",
          donorName: "Lisa Brown",
          quantity: 8,
          description: "Dairy products",
          location: "JP Nagar, Bangalore",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: "matched"
        },
        {
          id: "donation-005",
          donorId: "d001",
          donorName: "John Smith",
          quantity: 12,
          description: "Rice and pulses",
          location: "Whitefield, Bangalore",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          status: "expired"
        }
      ];

      const mockMatches: Match[] = [
        {
          id: "match-001",
          donationId: "donation-001",
          donorId: "d001",
          donorName: "John Smith",
          ngoId: "ngo001",
          ngoName: "Helping Hands",
          quantity: 10,
          matchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "accepted"
        },
        {
          id: "match-002",
          donationId: "donation-003",
          donorId: "d003",
          donorName: "Mike Wilson",
          ngoId: "ngo002",
          ngoName: "Food For All",
          quantity: 15,
          matchedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          status: "completed"
        },
        {
          id: "match-003",
          donationId: "donation-004",
          donorId: "d004",
          donorName: "Lisa Brown",
          ngoId: "ngo001",
          ngoName: "Helping Hands",
          quantity: 8,
          matchedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: "picked_up"
        }
      ];

      setDonations(mockDonations);
      setMatches(mockMatches);
      setLoading(false);
    }, 1000);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const getSortedAndFilteredData = () => {
    let data: any[] = activeTab === "donations" ? donations : matches;
    
    // Apply filters
    if (filterDonor) {
      data = data.filter(item => 
        item.donorName.toLowerCase().includes(filterDonor.toLowerCase()) ||
        item.donorId.toLowerCase().includes(filterDonor.toLowerCase())
      );
    }
    
    if (filterNgo && activeTab === "matches") {
      data = data.filter(item => 
        item.ngoName.toLowerCase().includes(filterNgo.toLowerCase()) ||
        item.ngoId.toLowerCase().includes(filterNgo.toLowerCase())
      );
    }
    
    if (filterStatus) {
      data = data.filter(item => item.status === filterStatus);
    }
    
    // Apply sorting
    data.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];
      
      if (sortBy === "timestamp" || sortBy === "matchedAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return data;
  };

  const getDonorStats = (): DonorStats[] => {
    const stats: { [key: string]: DonorStats } = {};
    
    donations.forEach(donation => {
      if (!stats[donation.donorId]) {
        stats[donation.donorId] = {
          donorId: donation.donorId,
          donorName: donation.donorName,
          totalDonations: 0,
          totalQuantity: 0
        };
      }
      stats[donation.donorId].totalDonations++;
      stats[donation.donorId].totalQuantity += donation.quantity;
    });
    
    return Object.values(stats).sort((a, b) => b.totalQuantity - a.totalQuantity);
  };

  const getNgoStats = (): NgoStats[] => {
    const stats: { [key: string]: NgoStats } = {};
    
    matches.forEach(match => {
      if (!stats[match.ngoId]) {
        stats[match.ngoId] = {
          ngoId: match.ngoId,
          ngoName: match.ngoName,
          totalMatches: 0,
          totalQuantity: 0
        };
      }
      stats[match.ngoId].totalMatches++;
      stats[match.ngoId].totalQuantity += match.quantity;
    });
    
    return Object.values(stats).sort((a, b) => b.totalQuantity - a.totalQuantity);
  };

  const getTotalFoodSaved = () => {
    return donations.reduce((total, donation) => total + donation.quantity, 0);
  };

  const formatDate = (dateString: string) => {
    return formatTimestamp(dateString);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "#ff9800";
      case "matched": return "#2196f3";
      case "accepted": return "#4caf50";
      case "picked_up": return "#9c27b0";
      case "completed": return "#4caf50";
      case "cancelled": return "#f44336";
      case "expired": return "#666";
      default: return "#666";
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "1rem", textAlign: "center" }}>
        <h2>Loading admin dashboard...</h2>
      </div>
    );
  }

  const sortedData = getSortedAndFilteredData();
  const donorStats = getDonorStats();
  const ngoStats = getNgoStats();
  const totalFoodSaved = getTotalFoodSaved();

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
          <h1 style={{ margin: "0", color: "#333" }}>👨‍💼 Admin Dashboard</h1>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
            Monitor donations, matches, and platform analytics
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          ← Back to Home
        </button>
      </div>

      {/* Analytics Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div style={{
          padding: "1.5rem",
          backgroundColor: "#e3f2fd",
          borderRadius: "8px",
          border: "1px solid #bbdefb",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#1976d2" }}>🍎 Total Food Saved</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#1976d2" }}>
            {totalFoodSaved}
          </div>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>items donated</p>
        </div>

        <div style={{
          padding: "1.5rem",
          backgroundColor: "#f3e5f5",
          borderRadius: "8px",
          border: "1px solid #e1bee7",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#7b1fa2" }}>📦 Total Donations</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#7b1fa2" }}>
            {donations.length}
          </div>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>donations made</p>
        </div>

        <div style={{
          padding: "1.5rem",
          backgroundColor: "#e8f5e8",
          borderRadius: "8px",
          border: "1px solid #c8e6c9",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#388e3c" }}>🤝 Total Matches</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#388e3c" }}>
            {matches.length}
          </div>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>successful matches</p>
        </div>

        <div style={{
          padding: "1.5rem",
          backgroundColor: "#fff3e0",
          borderRadius: "8px",
          border: "1px solid #ffcc80",
          textAlign: "center"
        }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#f57c00" }}>👥 Active Donors</h3>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f57c00" }}>
            {donorStats.length}
          </div>
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>unique donors</p>
        </div>
      </div>

      {/* Top Donors and NGOs */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
        gap: "1rem",
        marginBottom: "2rem"
      }}>
        <div style={{
          padding: "1.5rem",
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #ddd"
        }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#333" }}>🏆 Top Donors</h3>
          {donorStats.slice(0, 5).map((donor, index) => (
            <div key={donor.donorId} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem 0",
              borderBottom: index < 4 ? "1px solid #eee" : "none"
            }}>
              <div>
                <div style={{ fontWeight: "500" }}>{donor.donorName}</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>{donor.donorId}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold", color: "#4caf50" }}>{donor.totalQuantity} items</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>{donor.totalDonations} donations</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          padding: "1.5rem",
          backgroundColor: "white",
          borderRadius: "8px",
          border: "1px solid #ddd"
        }}>
          <h3 style={{ margin: "0 0 1rem 0", color: "#333" }}>🏥 Popular NGOs</h3>
          {ngoStats.slice(0, 5).map((ngo, index) => (
            <div key={ngo.ngoId} style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem 0",
              borderBottom: index < 4 ? "1px solid #eee" : "none"
            }}>
              <div>
                <div style={{ fontWeight: "500" }}>{ngo.ngoName}</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>{ngo.ngoId}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "bold", color: "#2196f3" }}>{ngo.totalQuantity} items</div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>{ngo.totalMatches} matches</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: "flex", 
        gap: "0.5rem", 
        marginBottom: "2rem",
        borderBottom: "1px solid #ddd"
      }}>
        <button
          onClick={() => setActiveTab("donations")}
          style={{
            padding: "1rem 2rem",
            backgroundColor: activeTab === "donations" ? "#667eea" : "#f0f0f0",
            color: activeTab === "donations" ? "white" : "#333",
            border: "none",
            cursor: "pointer",
            borderRadius: "8px 8px 0 0"
          }}
        >
          📦 Donations ({donations.length})
        </button>
        <button
          onClick={() => setActiveTab("matches")}
          style={{
            padding: "1rem 2rem",
            backgroundColor: activeTab === "matches" ? "#667eea" : "#f0f0f0",
            color: activeTab === "matches" ? "white" : "#333",
            border: "none",
            cursor: "pointer",
            borderRadius: "8px 8px 0 0"
          }}
        >
          🤝 Matches ({matches.length})
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        display: "flex", 
        gap: "1rem", 
        marginBottom: "2rem",
        flexWrap: "wrap"
      }}>
        <input
          type="text"
          placeholder="Filter by donor..."
          value={filterDonor}
          onChange={(e) => setFilterDonor(e.target.value)}
          style={{
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            minWidth: "200px"
          }}
        />
        {activeTab === "matches" && (
          <input
            type="text"
            placeholder="Filter by NGO..."
            value={filterNgo}
            onChange={(e) => setFilterNgo(e.target.value)}
            style={{
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              minWidth: "200px"
            }}
          />
        )}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: "0.5rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            minWidth: "150px"
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="matched">Matched</option>
          <option value="accepted">Accepted</option>
          <option value="picked_up">Picked Up</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Data Table */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #ddd",
        overflow: "auto"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              {activeTab === "donations" ? (
                <>
                  <th style={{ padding: "1rem", textAlign: "left", cursor: "pointer" }} onClick={() => handleSort("donorId")}>
                    Donor {sortBy === "donorId" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Description</th>
                  <th style={{ padding: "1rem", textAlign: "left", cursor: "pointer" }} onClick={() => handleSort("quantity")}>
                    Quantity {sortBy === "quantity" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Location</th>
                  <th style={{ padding: "1rem", textAlign: "left", cursor: "pointer" }} onClick={() => handleSort("timestamp")}>
                    Date {sortBy === "timestamp" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
                </>
              ) : (
                <>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Donor</th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>NGO</th>
                  <th style={{ padding: "1rem", textAlign: "left", cursor: "pointer" }} onClick={() => handleSort("quantity")}>
                    Quantity {sortBy === "quantity" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left", cursor: "pointer" }} onClick={() => handleSort("matchedAt")}>
                    Matched Date {sortBy === "matchedAt" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th style={{ padding: "1rem", textAlign: "left" }}>Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={item.id} style={{ borderTop: "1px solid #eee" }}>
                {activeTab === "donations" ? (
                  <>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: "500" }}>{(item as Donation).donorName}</div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>{(item as Donation).donorId}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>{(item as Donation).description}</td>
                    <td style={{ padding: "1rem" }}>{(item as Donation).quantity}</td>
                    <td style={{ padding: "1rem" }}>{(item as Donation).location}</td>
                    <td style={{ padding: "1rem" }}>{formatDate((item as Donation).timestamp)}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{
                        padding: "0.25rem 0.75rem",
                        backgroundColor: getStatusColor((item as Donation).status),
                        color: "white",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        textTransform: "capitalize"
                      }}>
                        {(item as Donation).status}
                      </span>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: "500" }}>{(item as Match).donorName}</div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>{(item as Match).donorId}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ fontWeight: "500" }}>{(item as Match).ngoName}</div>
                      <div style={{ fontSize: "0.8rem", color: "#666" }}>{(item as Match).ngoId}</div>
                    </td>
                    <td style={{ padding: "1rem" }}>{(item as Match).quantity}</td>
                    <td style={{ padding: "1rem" }}>{formatDate((item as Match).matchedAt)}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{
                        padding: "0.25rem 0.75rem",
                        backgroundColor: getStatusColor((item as Match).status),
                        color: "white",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        textTransform: "capitalize"
                      }}>
                        {(item as Match).status.replace("_", " ")}
                      </span>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          color: "#666"
        }}>
          <h3>No {activeTab} found matching the filters</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage; 