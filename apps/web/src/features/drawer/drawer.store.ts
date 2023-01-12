import { VoidFn } from "@/types";
import { ReactElement } from "react";
import { create } from "zustand";

interface Config {
  header?: ReactElement;
  body?: ReactElement;
  footer?: ReactElement;
}

interface DrawerStore {
  isOpen: boolean;
  setIsOpen: VoidFn<boolean>;
  config: Config;
  setConfig: VoidFn<Config>;
}

export const useDrawer = create<DrawerStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set(() => ({ isOpen })),
  config: {},
  setConfig: (config) => set(() => ({ config })),
}));
