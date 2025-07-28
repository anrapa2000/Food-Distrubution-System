export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  quantity: number;
  description: string;
  lat: number;
  lon: number;
  location: string; // Reverse geocoded city name
  timestamp: string;
  status: "PENDING" | "ACCEPTED" | "DELIVERED" | "EXPIRED" | "CANCELLED";
  expiryTime: string;
  category?: string;
  condition?: "FRESH" | "GOOD" | "FAIR";
  pickupInstructions?: string;
}

export interface DonationWithGeocode extends Donation {
  geocodedLocation: string;
  distanceFromNgo?: number;
} 