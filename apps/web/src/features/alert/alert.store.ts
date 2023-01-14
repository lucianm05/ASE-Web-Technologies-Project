import { Alert, VoidFn } from "@/types";
import { create } from "zustand";

let id = 0;

interface AlertStore {
  alerts: Alert[];
  dispatchAlert: VoidFn<Omit<Alert, "id">>;
  closeAlert: VoidFn<number>;
  success: VoidFn<string>;
  error: VoidFn<string>;
}

const useAlert = create<AlertStore>((set, get) => ({
  alerts: [],
  dispatchAlert: (alert) =>
    set((state) => {
      id++;
      return { alerts: [...state.alerts, { ...alert, id }] };
    }),
  closeAlert: (id) =>
    set((state) => ({ alerts: state.alerts.filter((a) => a.id !== id) })),
  success: (message) => get().dispatchAlert({ message, type: "success" }),
  error: (message) => get().dispatchAlert({ message, type: "error" }),
}));

export default useAlert;
