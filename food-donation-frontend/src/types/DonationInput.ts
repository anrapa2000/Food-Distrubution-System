export interface DonationInput {
    donorId: string;
    description: string;
    quantity: number;
    lat: number;
    lon: number;
    timestamp: string;
    category?: string;
    condition?: "FRESH" | "GOOD" | "FAIR";
    pickupInstructions?: string;
    expiryTime: string;
  }
  