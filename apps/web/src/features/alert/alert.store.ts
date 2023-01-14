import { Alert } from "@/types";
import { create } from "zustand";

let id = 0;

interface AlertStore {
  alerts: Alert[];
  dispatchAlert: (payload: Omit<Alert, "id">) => void;
  closeAlert: (id: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const useAlert = create<AlertStore>((set, get) => ({
  alerts: [],
  dispatchAlert: (alert) =>
    set((state) => {
      id++;
      console.log(id);
      return { alerts: [...state.alerts, { ...alert, id }] };
    }),
  closeAlert: (id) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
  success: (message) => get().dispatchAlert({ message, type: "success" }),
  error: (message) => get().dispatchAlert({ message, type: "error" }),
}));

export default useAlert;
