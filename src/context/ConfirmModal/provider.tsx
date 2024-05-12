import { useCallback, useMemo, useRef, useState } from "react";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import { ConfirmModalContext, openModalOptions } from "./context";

export const ConfirmModalProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const resolveRef = useRef<
    ((value: boolean | PromiseLike<boolean>) => void) | null
  >(null);
  const [title, setTitle] = useState<React.ReactNode>("");
  const [message, setMessage] = useState<React.ReactNode>("");
  const [confirmButtonText, setConfirmButtonText] = useState<
    string | undefined
  >();
  const [cancelButtonText, setCancelButtonText] = useState<
    string | undefined
  >();
  const [show, setShow] = useState<boolean>(false);
  const [isDanger, setIsDanger] = useState<boolean>(false);

  const handleConfirm = () => {
    setShow(false);
    resolveRef.current?.(true);
    resolveRef.current = null;
  };

  const handleCancel = () => {
    setShow(false);
    resolveRef.current?.(false);
    resolveRef.current = null;
  };

  const openModal = useCallback(
    async ({
      title,
      message,
      confirmButtonText,
      cancelButtonText,
      isDanger,
    }: openModalOptions) => {
      if (resolveRef.current) {
        return Promise.resolve(false);
      }
      return new Promise<boolean>((resolve) => {
        resolveRef.current = resolve;
        setTitle(title);
        setMessage(message);
        setConfirmButtonText(confirmButtonText);
        setCancelButtonText(cancelButtonText);
        setIsDanger(isDanger ?? false);
        setShow(true);
      });
    },
    [],
  );

  const contextValue: ConfirmModalContext = useMemo(
    () => ({ openModal }),
    [openModal],
  );

  return (
    <ConfirmModalContext.Provider value={contextValue}>
      {children}
      <ConfirmationModal
        title={title}
        message={message}
        confirmButtonText={confirmButtonText}
        cancelButtonText={cancelButtonText}
        show={show}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        isDanger={isDanger}
      />
    </ConfirmModalContext.Provider>
  );
};
