import dict from "@/constants/dict";
import queryKeys from "@/constants/query-keys";
import useAlert from "@/features/alert/alert.store";
import { MessageResponse } from "@/types";
import { fetcher, FetchError } from "@/utils/fetcher";
import { useQueryClient } from "react-query";

export const reserveParkingLot = async (id: number) => {
  const res = await fetcher<MessageResponse>(`/parking-lot/${id}`, {
    method: "PATCH",
  });
  return res;
};

export const useReserverParkingLot = () => {
  const { success, error } = useAlert();
  const queryClient = useQueryClient();

  const reserveParkingLotHandler = async (id: number) => {
    try {
      const res = await reserveParkingLot(id);
      await queryClient.refetchQueries({ queryKey: queryKeys.parkingLots });
      success(dict.en.success);

      return res;
    } catch (err) {
      console.error(err);

      if (!(err instanceof FetchError)) return;

      error(err.data.message);
    }
  };

  return reserveParkingLotHandler;
};
