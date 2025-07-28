import { useEffect, useState } from "react";
import { fetchAllMatches, fetchMatchesByDonor } from "../api/matchedDonations";
import { MatchedDonation } from "../types/MatchedDonation";
import MatchMap from "../components/MatchMap";

const MatchesPage = () => {
  const [matches, setMatches] = useState<MatchedDonation[]>([]);
  const [donorId, setDonorId] = useState("");
  const [error, setError] = useState("");

  const loadAllMatches = async () => {
    try {
      const data = await fetchAllMatches();
      setMatches(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch all matches.");
    }
  };

  const searchMatches = async () => {
    try {
      const data = await fetchMatchesByDonor(donorId);
      setMatches(data);
      setError("");
    } catch (err) {
      setError("No matches found or server error.");
    }
  };

  useEffect(() => {
    loadAllMatches();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Matched Donations</h2>
      <MatchMap matches={matches} />

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          value={donorId}
          onChange={(e) => setDonorId(e.target.value)}
          placeholder="Enter Donor ID (e.g. d001)"
        />
        <button onClick={searchMatches} style={{ marginLeft: "0.5rem" }}>
          Search
        </button>
        <button onClick={loadAllMatches} style={{ marginLeft: "0.5rem" }}>
          Clear
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {matches.map((match) => (
          <li key={match.donationId}>
            <strong>{match.donorId}</strong> → <em>{match.ngoName}</em> ({match.quantity} items)<br />
            <small>{new Date(match.timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchesPage;
