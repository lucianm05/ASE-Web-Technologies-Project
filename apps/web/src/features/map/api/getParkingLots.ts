import { fetcher } from "@/utils/fetcher";
import { ParkingLotDTO } from "types";

export const getParkingLots = async () => {
  const res = await fetcher<ParkingLotDTO[]>("/parking-lot");
  return res.data;
};
