import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MatchesPage from "./pages/MatchesPage";
import AddDonationPage from "./pages/AddDonationPage";
import MyDonationsPage from "./pages/MyDonationsPage"; // 👈 Import this

function App() {
  return (
    <Router>
      <div style={{ padding: "1rem" }}>
        <h1>Food Donation Matching Platform</h1>
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/">Home</Link> |{" "}
          <Link to="/add">Add Donation</Link> |{" "}
          <Link to="/my-donations">My Donations</Link> {/* 👈 Add new link */}
        </nav>

        <Routes>
          <Route path="/" element={<MatchesPage />} />
          <Route path="/add" element={<AddDonationPage />} />
          <Route path="/my-donations" element={<MyDonationsPage />} /> {/* 👈 Add route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
