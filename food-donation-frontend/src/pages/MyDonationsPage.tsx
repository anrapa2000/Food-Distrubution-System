import { useState } from "react";
import axios from "axios";
import { MatchedDonation } from "../types/MatchedDonation";

const MyDonationsPage = () => {
  const [donorId, setDonorId] = useState("");
  const [donations, setDonations] = useState<MatchedDonation[]>([]);
  const [error, setError] = useState("");

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
            {donations.map((d) => (
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
