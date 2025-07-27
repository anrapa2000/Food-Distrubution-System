import axios from "axios";
import { DonationInput } from "../types/DonationInput";

const DONOR_SERVICE_URL = "http://localhost:8081";

export const submitDonation = async (donation: DonationInput) => {
  const response = await axios.post(`${DONOR_SERVICE_URL}/donations`, donation);
  return response.data;
};
