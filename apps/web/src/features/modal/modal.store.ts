import { VoidFn } from "@/types";
import { create } from "zustand";
import { ReactNode } from "react";

interface Config {
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  classNames?: {
    header?: string;
    body?: string;
    footer?: string;
  };
}

interface ModalStore {
  isOpen: boolean;
  setIsOpen: VoidFn<boolean>;
  config: Config;
  setConfig: VoidFn<Config>;
}

const useModal = create<ModalStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set(() => ({ isOpen })),
  config: {},
  setConfig: (config) => set(() => ({ config })),
}));

export default useModal;
