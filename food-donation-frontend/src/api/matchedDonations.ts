import axios from "axios";
import { MatchedDonation } from "../types/MatchedDonation";

const BASE_URL = "http://localhost:8082";

export const fetchAllMatches = async (): Promise<MatchedDonation[]> => {
  const response = await axios.get(`${BASE_URL}/matches`);
  return response.data;
};

export const fetchMatchesByDonor = async (donorId: string): Promise<MatchedDonation[]> => {
  const response = await axios.get(`${BASE_URL}/matches/${donorId}`);
  return response.data;
};
