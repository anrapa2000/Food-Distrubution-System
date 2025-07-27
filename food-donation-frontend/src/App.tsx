import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MatchesPage from "./pages/MatchesPage";
import AddDonationPage from "./pages/AddDonationPage";

function App() {
  return (
    <Router>
      <div style={{ padding: "1rem" }}>
        <h1>Food Donation Matching Platform</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/add">Add Donation</Link>
        </nav>

        <Routes>
          <Route path="/" element={<MatchesPage />} />
          <Route path="/add" element={<AddDonationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
