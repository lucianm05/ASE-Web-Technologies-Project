import dict from "@/constants/dict";
import useAlert from "@/features/alert/alert.store";
import { fetcher } from "@/utils/fetcher";
import { ParkingLotPayload } from "types";

export const createParkingLot = async (payload: ParkingLotPayload) => {
  const res = await fetcher<{ id: number }>("/parking-lot", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res;
};

export const useCreateParkingLot = () => {
  const { success } = useAlert();

  const createParkingLotHandler = async (payload: ParkingLotPayload) => {
    try {
      const res = await createParkingLot(payload);
      success(dict.en.success);
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  return createParkingLotHandler;
};
