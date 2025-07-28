import { useState, useMemo } from "react";
import axios from "axios";
import { MatchedDonation } from "../types/MatchedDonation";
import MatchMap from "../components/MatchMap";

interface EditingDonation {
  donationId: string;
  quantity: number;
  ngoName: string;
}

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
  
  // Edit/Delete states
  const [editingDonation, setEditingDonation] = useState<EditingDonation | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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

    const handleEdit = (donation: MatchedDonation) => {
      setEditingDonation({
        donationId: donation.donationId,
        quantity: donation.quantity,
        ngoName: donation.ngoName
      });
    };

    const handleSave = async () => {
      if (!editingDonation) return;
      
      try {
        await axios.put(`http://localhost:8082/matches/${editingDonation.donationId}`, {
          quantity: editingDonation.quantity,
          ngoName: editingDonation.ngoName
        });
        
        // Update local state
        setDonations(donations.map(d => 
          d.donationId === editingDonation.donationId 
            ? { ...d, quantity: editingDonation.quantity, ngoName: editingDonation.ngoName }
            : d
        ));
        
        setEditingDonation(null);
      } catch (err) {
        setError("Failed to update donation");
      }
    };

    const handleCancel = () => {
      setEditingDonation(null);
    };

    const handleDelete = async (donationId: string) => {
      if (!window.confirm("Are you sure you want to delete this donation?")) return;
      
      setIsDeleting(donationId);
      try {
        await axios.delete(`http://localhost:8082/matches/${donationId}`);
        setDonations(donations.filter(d => d.donationId !== donationId));
      } catch (err) {
        setError("Failed to delete donation");
      } finally {
        setIsDeleting(null);
      }
    };

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
          
          {/* Real-time Map */}
          <div style={{ marginTop: "1rem" }}>
            <h3>Map View</h3>
            <MatchMap matches={filteredDonations} />
          </div>
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
                <th>Actions</th>
              </tr>
            </thead>
          <tbody>
            {filteredDonations.map((d) => (
              <tr key={d.donationId}>
                <td>{d.donationId}</td>
                <td>
                  {editingDonation?.donationId === d.donationId ? (
                    <input
                      type="text"
                      value={editingDonation.ngoName}
                      onChange={(e) => setEditingDonation({...editingDonation, ngoName: e.target.value})}
                      style={{ width: "100px" }}
                    />
                  ) : (
                    d.ngoName
                  )}
                </td>
                <td>
                  {editingDonation?.donationId === d.donationId ? (
                    <input
                      type="number"
                      value={editingDonation.quantity}
                      onChange={(e) => setEditingDonation({...editingDonation, quantity: parseInt(e.target.value) || 0})}
                      style={{ width: "60px" }}
                    />
                  ) : (
                    d.quantity
                  )}
                </td>
                <td>{d.lat}</td>
                <td>{d.lon}</td>
                <td>{new Date(d.timestamp).toLocaleString()}</td>
                <td>
                  {editingDonation?.donationId === d.donationId ? (
                    <>
                      <button 
                        onClick={handleSave}
                        style={{ marginRight: "0.25rem", padding: "0.25rem 0.5rem", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "3px" }}
                      >
                        Save
                      </button>
                      <button 
                        onClick={handleCancel}
                        style={{ padding: "0.25rem 0.5rem", backgroundColor: "#f0f0f0", border: "1px solid #ccc", borderRadius: "3px" }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleEdit(d)}
                        style={{ marginRight: "0.25rem", padding: "0.25rem 0.5rem", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "3px" }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(d.donationId)}
                        disabled={isDeleting === d.donationId}
                        style={{ padding: "0.25rem 0.5rem", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "3px" }}
                      >
                        {isDeleting === d.donationId ? "Deleting..." : "Delete"}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyDonationsPage;
