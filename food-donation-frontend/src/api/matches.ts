import axios from "axios";
import { MatchedDonation } from "../types/MatchedDonation";

export const fetchMatchesByDonorId = async (donorId: string): Promise<MatchedDonation[]> => {
  const res = await axios.get(`http://localhost:8082/matches/${donorId}`);
  return res.data;
};
