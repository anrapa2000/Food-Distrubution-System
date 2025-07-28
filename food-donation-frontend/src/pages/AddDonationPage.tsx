import { useState, useEffect } from "react";
import { submitDonation } from "../api/donations";
import { DonationInput } from "../types/DonationInput";
import { getCachedGeocode } from "../utils/geocoding";
import { formatTimestamp } from "../utils/dateUtils";

const AddDonationPage = () => {
  const [donation, setDonation] = useState<DonationInput>({
    donorId: "",
    description: "",
    quantity: 0,
    lat: 0,
    lon: 0,
    timestamp: new Date().toISOString(),
    category: "",
    condition: "FRESH",
    pickupInstructions: "",
    expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [geocodedLocation, setGeocodedLocation] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDonation({ ...donation, [name]: value });
  };

  // Geocode location when coordinates change
  useEffect(() => {
    if (donation.lat && donation.lon) {
      setIsGeocoding(true);
      getCachedGeocode(donation.lat, donation.lon)
        .then(location => {
          setGeocodedLocation(location);
          setIsGeocoding(false);
        })
        .catch(() => {
          setGeocodedLocation("Unknown Location");
          setIsGeocoding(false);
        });
    }
  }, [donation.lat, donation.lon]);

  const handleSubmit = async () => {
    try {
      const donationWithLocation = {
        ...donation,
        quantity: Number(donation.quantity),
        location: geocodedLocation || "Unknown Location"
      };
      await submitDonation(donationWithLocation);
      setSuccess(true);
      setError("");
    } catch (err) {
      setSuccess(false);
      setError("Failed to submit donation.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🍎 Add New Donation</h2>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
        gap: "1rem",
        marginBottom: "1rem"
      }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Donor ID *
          </label>
          <input 
            name="donorId" 
            placeholder="e.g., d001" 
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Category
          </label>
          <select 
            name="category" 
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
          >
            <option value="">Select Category</option>
            <option value="FRESH_PRODUCE">Fresh Produce</option>
            <option value="DAIRY">Dairy</option>
            <option value="BAKERY">Bakery</option>
            <option value="CANNED_GOODS">Canned Goods</option>
            <option value="DRY_FOOD">Dry Food</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          Description *
        </label>
        <textarea 
          name="description" 
          placeholder="Describe the food items being donated..." 
          onChange={handleChange}
          style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px", minHeight: "80px" }}
        />
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "1rem",
        marginBottom: "1rem"
      }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Quantity *
          </label>
          <input 
            name="quantity" 
            type="number" 
            placeholder="Number of items" 
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Condition
          </label>
          <select 
            name="condition" 
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
          >
            <option value="FRESH">Fresh</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
          </select>
        </div>
      </div>

      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: "1rem",
        marginBottom: "1rem"
      }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Latitude *
          </label>
          <input 
            name="lat" 
            type="number" 
            step="0.0001" 
            placeholder="e.g., 12.9716" 
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Longitude *
          </label>
          <input 
            name="lon" 
            type="number" 
            step="0.0001" 
            placeholder="e.g., 77.5946" 
            onChange={handleChange}
            style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
          />
        </div>
      </div>

      {isGeocoding && (
        <div style={{ 
          padding: "0.5rem", 
          backgroundColor: "#e3f2fd", 
          color: "#1976d2",
          borderRadius: "4px",
          marginBottom: "1rem"
        }}>
          🔍 Looking up location...
        </div>
      )}

      {geocodedLocation && !isGeocoding && (
        <div style={{ 
          padding: "0.5rem", 
          backgroundColor: "#e8f5e8", 
          color: "#2e7d32",
          borderRadius: "4px",
          marginBottom: "1rem"
        }}>
          📍 Location: <strong>{geocodedLocation}</strong>
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          Pickup Instructions
        </label>
        <textarea 
          name="pickupInstructions" 
          placeholder="Any special instructions for pickup..." 
          onChange={handleChange}
          style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px", minHeight: "60px" }}
        />
      </div>

      <div style={{ 
        padding: "1rem", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "8px",
        marginBottom: "1rem"
      }}>
        <h4 style={{ margin: "0 0 0.5rem 0" }}>📅 Donation Details</h4>
        <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
          <strong>Created:</strong> {formatTimestamp(donation.timestamp)}
        </p>
        <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
          <strong>Expires:</strong> {formatTimestamp(donation.expiryTime)}
        </p>
        <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
          <strong>Status:</strong> <span style={{ color: "#ff9800" }}>PENDING</span>
        </p>
      </div>

      <button 
        onClick={handleSubmit} 
        style={{ 
          padding: "0.75rem 2rem", 
          backgroundColor: "#4caf50", 
          color: "white", 
          border: "none", 
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "500"
        }}
      >
        🍎 Submit Donation
      </button>

      {success && (
        <div style={{ 
          padding: "1rem", 
          backgroundColor: "#e8f5e8", 
          color: "#2e7d32",
          borderRadius: "8px",
          marginTop: "1rem"
        }}>
          ✅ Donation submitted successfully! It will be matched with nearby NGOs.
        </div>
      )}
      {error && (
        <div style={{ 
          padding: "1rem", 
          backgroundColor: "#ffebee", 
          color: "#c62828",
          borderRadius: "8px",
          marginTop: "1rem"
        }}>
          ❌ {error}
        </div>
      )}
    </div>
  );
};

export default AddDonationPage;
