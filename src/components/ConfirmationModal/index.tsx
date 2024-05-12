import { Button, Modal } from "react-bootstrap";

type ConfirmationModalProps = {
  title: React.ReactNode;
  message: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDanger?: boolean;
  show: boolean;
};
export const ConfirmationModal = ({
  title,
  message,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  onCancel,
  onConfirm,
  show,
  isDanger,
}: ConfirmationModalProps) => {
  return (
    <Modal
      centered={true}
      show={show}
      onHide={() => {
        onCancel();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="fs-4 text-center">{message}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={isDanger ? "danger" : "primary"}
          className="w00"
          onClick={() => {
            onConfirm();
          }}
        >
          {confirmButtonText}
        </Button>
        <Button
          variant={"outline-dark"}
          className="w00"
          onClick={() => {
            onCancel();
          }}
        >
          {cancelButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
