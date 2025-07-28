import { useState, useMemo } from "react";
import axios from "axios";
import { MatchedDonation } from "../types/MatchedDonation";

const MyDonationsPage = () => {
  const [donorId, setDonorId] = useState("");
  const [donations, setDonations] = useState<MatchedDonation[]>([]);
  const [error, setError] = useState("");
  
  // Filter states
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");
  const [ngoFilter, setNgoFilter] = useState("");

  const fetchDonations = async () => {
    try {
      const res = await axios.get<MatchedDonation[]>(
        `http://localhost:8082/matches/${donorId}`
      );
      setDonations(res.data);
      setError("");
          } catch (err) {
        setError("Could not fetch donations. Make sure donor ID is valid.");
        setDonations([]);
      }
    };

    // Filter donations based on criteria
    const filteredDonations = useMemo(() => {
      return donations.filter((donation) => {
        const donationDate = new Date(donation.timestamp);
        
        // Date range filter
        if (dateFrom && donationDate < new Date(dateFrom)) return false;
        if (dateTo && donationDate > new Date(dateTo)) return false;
        
        // Quantity range filter
        if (minQuantity && donation.quantity < parseInt(minQuantity)) return false;
        if (maxQuantity && donation.quantity > parseInt(maxQuantity)) return false;
        
        // NGO name filter
        if (ngoFilter && !donation.ngoName.toLowerCase().includes(ngoFilter.toLowerCase())) return false;
        
        return true;
      });
    }, [donations, dateFrom, dateTo, minQuantity, maxQuantity, ngoFilter]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>My Donations</h2>
      <input
        placeholder="Enter Donor ID"
        value={donorId}
        onChange={(e) => setDonorId(e.target.value)}
        style={{ marginRight: "0.5rem" }}
      />
      <button onClick={fetchDonations}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {donations.length > 0 && (
        <>
          {/* Filters */}
          <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "4px" }}>
            <h3>Filters</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              <div>
                <label>Date From:</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={{ display: "block", marginTop: "0.25rem" }}
                />
              </div>
              <div>
                <label>Date To:</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={{ display: "block", marginTop: "0.25rem" }}
                />
              </div>
              <div>
                <label>Min Quantity:</label>
                <input
                  type="number"
                  value={minQuantity}
                  onChange={(e) => setMinQuantity(e.target.value)}
                  placeholder="Min"
                  style={{ display: "block", marginTop: "0.25rem" }}
                />
              </div>
              <div>
                <label>Max Quantity:</label>
                <input
                  type="number"
                  value={maxQuantity}
                  onChange={(e) => setMaxQuantity(e.target.value)}
                  placeholder="Max"
                  style={{ display: "block", marginTop: "0.25rem" }}
                />
              </div>
              <div>
                <label>NGO Name:</label>
                <input
                  type="text"
                  value={ngoFilter}
                  onChange={(e) => setNgoFilter(e.target.value)}
                  placeholder="Search NGO..."
                  style={{ display: "block", marginTop: "0.25rem" }}
                />
              </div>
            </div>
            <button 
              onClick={() => {
                setDateFrom("");
                setDateTo("");
                setMinQuantity("");
                setMaxQuantity("");
                setNgoFilter("");
              }}
              style={{ marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#f0f0f0", border: "1px solid #ccc" }}
            >
              Clear Filters
            </button>
          </div>

          <p style={{ marginTop: "1rem" }}>
            Showing {filteredDonations.length} of {donations.length} donations
          </p>
        </>
      )}

      {filteredDonations.length > 0 && (
        <table border={1} cellPadding={8} style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Donation ID</th>
              <th>NGO</th>
              <th>Quantity</th>
              <th>Lat</th>
              <th>Lon</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map((d) => (
              <tr key={d.donationId}>
                <td>{d.donationId}</td>
                <td>{d.ngoName}</td>
                <td>{d.quantity}</td>
                <td>{d.lat}</td>
                <td>{d.lon}</td>
                <td>{new Date(d.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyDonationsPage;
