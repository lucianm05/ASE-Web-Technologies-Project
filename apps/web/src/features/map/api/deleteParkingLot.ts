import dict from "@/constants/dict";
import queryKeys from "@/constants/query-keys";
import useAlert from "@/features/alert/alert.store";
import { MessageResponse } from "@/types";
import { fetcher, FetchError } from "@/utils/fetcher";
import { useQueryClient } from "react-query";

export const deleteParkingLot = async (id: number) => {
  const res = await fetcher<MessageResponse>(`/parking-lot/${id}`, {
    method: "DELETE",
  });
  return res;
};

export const useDeleteParkingLot = () => {
  const { success, error } = useAlert();
  const queryClient = useQueryClient();

  const deleteParkingLotHandler = async (id: number) => {
    try {
      const res = await deleteParkingLot(id);
      queryClient.refetchQueries({ queryKey: queryKeys.parkingLots });
      success(dict.en.success);

      return res;
    } catch (err) {
      console.error(err);

      if (!(err instanceof FetchError)) return;

      error(err.data.message);
    }
  };

  return deleteParkingLotHandler;
};
