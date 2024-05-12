import { createContext, useContext } from "react";

export type openModalOptions = {
  title: React.ReactNode;
  message: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isDanger?: boolean;
};

export type ConfirmModalContext = {
  openModal: (options: openModalOptions) => Promise<boolean>;
};

export const ConfirmModalContext = createContext<ConfirmModalContext>(
  {} as ConfirmModalContext,
);

export const useConfirmModal = () => useContext(ConfirmModalContext);
