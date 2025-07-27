import { useState } from "react";
import { submitDonation } from "../api/donations";
import { DonationInput } from "../types/DonationInput";

const AddDonationPage = () => {
  const [donation, setDonation] = useState<DonationInput>({
    donorId: "",
    description: "",
    quantity: 0,
    lat: 0,
    lon: 0,
    timestamp: new Date().toISOString(),
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDonation({ ...donation, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await submitDonation({ ...donation, quantity: Number(donation.quantity) });
      setSuccess(true);
      setError("");
    } catch (err) {
      setSuccess(false);
      setError("Failed to submit donation.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Add New Donation</h2>

      <input name="donorId" placeholder="Donor ID" onChange={handleChange} /><br />
      <textarea name="description" placeholder="Description" onChange={handleChange} /><br />
      <input name="quantity" type="number" placeholder="Quantity" onChange={handleChange} /><br />
      <input name="lat" type="number" step="0.0001" placeholder="Latitude" onChange={handleChange} /><br />
      <input name="lon" type="number" step="0.0001" placeholder="Longitude" onChange={handleChange} /><br />

      <button onClick={handleSubmit} style={{ marginTop: "1rem" }}>Submit Donation</button>

      {success && <p style={{ color: "green" }}>✅ Donation submitted successfully!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AddDonationPage;
