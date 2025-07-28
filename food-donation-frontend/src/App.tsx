import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MatchesPage from "./pages/MatchesPage";
import AddDonationPage from "./pages/AddDonationPage";
import MyDonationsPage from "./pages/MyDonationsPage";
import NgoLoginPage from "./pages/NgoLoginPage";
import NgoDashboardPage from "./pages/NgoDashboardPage";
import DonationOffersPage from "./pages/DonationOffersPage";
import NgoRequestsPage from "./pages/NgoRequestsPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <Router>
      <div style={{ padding: "1rem" }}>
        <h1>Food Donation Matching Platform</h1>
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/">Home</Link> |{" "}
          <Link to="/add">Add Donation</Link> |{" "}
          <Link to="/my-donations">My Donations</Link> |{" "}
          <Link to="/ngo-login">NGO Login</Link> |{" "}
          <Link to="/admin">Admin</Link>
        </nav>

        <Routes>
          <Route path="/" element={<MatchesPage />} />
          <Route path="/add" element={<AddDonationPage />} />
          <Route path="/my-donations" element={<MyDonationsPage />} />
          <Route path="/ngo-login" element={<NgoLoginPage />} />
          <Route path="/ngo-dashboard" element={<NgoDashboardPage />} />
          <Route path="/donation-offers" element={<DonationOffersPage />} />
          <Route path="/ngo-requests" element={<NgoRequestsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
