import dict from "@/constants/dict";
import queryKeys from "@/constants/query-keys";
import useAlert from "@/features/alert/alert.store";
import { MessageResponse } from "@/types";
import { fetcher, FetchError } from "@/utils/fetcher";
import { useQueryClient } from "react-query";
import { ParkingLotPayload } from "types";

export const editParkingLot = async (
  id: number,
  payload: ParkingLotPayload
) => {
  const res = await fetcher<MessageResponse>(`/parking-lot/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return res;
};

export const useEditParkingLot = () => {
  const { success, error } = useAlert();
  const queryClient = useQueryClient();

  const editParkingLotHandler = async (
    id: number,
    payload: ParkingLotPayload
  ) => {
    try {
      const res = await editParkingLot(id, payload);
      await queryClient.refetchQueries({ queryKey: queryKeys.parkingLots });
      success(dict.en.success);

      return res;
    } catch (err) {
      console.error(err);

      if (!(err instanceof FetchError)) return;

      error(err.data.message);
    }
  };

  return editParkingLotHandler;
};
