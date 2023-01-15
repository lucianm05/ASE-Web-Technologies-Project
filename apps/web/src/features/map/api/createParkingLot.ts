import dict from "@/constants/dict";
import queryKeys from "@/constants/query-keys";
import useAlert from "@/features/alert/alert.store";
import { fetcher, FetchError } from "@/utils/fetcher";
import { useQueryClient } from "react-query";
import { ParkingLotPayload } from "types";

export const createParkingLot = async (payload: ParkingLotPayload) => {
  const res = await fetcher<{ id: number }>("/parking-lot", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res;
};

export const useCreateParkingLot = () => {
  const { success, error } = useAlert();
  const queryClient = useQueryClient();

  const createParkingLotHandler = async (payload: ParkingLotPayload) => {
    try {
      const res = await createParkingLot(payload);
      await queryClient.refetchQueries({ queryKey: queryKeys.parkingLots });
      success(dict.en.success);

      return res;
    } catch (err) {
      console.error(err);

      if (!(err instanceof FetchError)) return;

      if (err.response.status === 400) {
        error(dict.en.missing_or_invalid_values);
        return;
      }

      error(err.data.message);
    }
  };

  return createParkingLotHandler;
};
