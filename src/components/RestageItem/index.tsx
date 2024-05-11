import ListGroup from "react-bootstrap/ListGroup";
import Icon from "@mdi/react";
import {
  mdiCellphone,
  mdiCheck,
  mdiClockOutline,
  mdiMapMarker,
  mdiMapMarkerOutline,
  mdiWhatsapp,
} from "@mdi/js";
import { Badge, Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import moment from "moment";
import "moment/dist/locale/pt-br";
import { QueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/api";
import {
  APIConfirmRequest,
  APIResponse,
  formatarDistancia,
} from "../../config/define";
import { useState } from "react";

type RestageItemProps = {
  rescueId: string;
  requestDateTime: string;
  adultsNumber: number;
  childrenNumber: number;
  elderlyNumber: number;
  animalsNumber: number;
  disabledNumber: number;
  cellphone?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
  confirm?: boolean;
  rescued?: boolean;
};

const queryClient = new QueryClient();

export default function RestageItem(props: RestageItemProps) {
  const { token } = useAuth();
  const { post } = useApi();

  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [removed, setRemoved] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    setModal(false);
    const data: APIConfirmRequest = {
      rescueId: props.rescueId,
    };

    const resp = await post<APIConfirmRequest, APIResponse>(
      `${import.meta.env.VITE_API_URL}/Rescue/Confirm`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (resp.Result === 1) {
      queryClient.invalidateQueries({
        refetchType: "all",
        queryKey: ["ListPengingRescues"],
      });
      queryClient.invalidateQueries({
        refetchType: "all",
        queryKey: ["ListCompletedRescues"],
      });
      queryClient.resetQueries();
      setRemoved(true);
    } else {
      alert(resp.Message ?? "Ocorreu algum problema, tente novamente");
    }
    setLoading(false);
  }

  if (removed) return null;

  return (
    <ListGroup.Item>
      <div className="d-flex flex-column gap-2">
        <Row>
          <Col>
            <div className="d-flex align-items-center text-muted justify-content-start">
              <Icon path={mdiClockOutline} size={0.7} className="me-1" />
              {moment(props.requestDateTime).locale("pt-br").fromNow()}
            </div>
          </Col>
          {props.distance && (
            <Col>
              <div className="d-flex align-items-center text-muted justify-content-end">
                <Icon path={mdiMapMarkerOutline} size={0.7} className="me-1" />
                {formatarDistancia(props.distance)}
              </div>
            </Col>
          )}
        </Row>
        <Row>
          {props.adultsNumber > 0 && (
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <div className="fw-bold fs-1">{props.adultsNumber}</div>
              <div className="fw-medium text-muted">Adultos</div>
            </Col>
          )}
          {props.childrenNumber > 0 && (
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <div className="fw-bold fs-1">{props.childrenNumber}</div>
              <div className="fw-medium text-muted">Crianças</div>
            </Col>
          )}
          {props.elderlyNumber > 0 && (
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <div className="fw-bold fs-1">{props.elderlyNumber}</div>
              <div className="fw-medium text-muted">Idosos</div>
            </Col>
          )}
          {props.animalsNumber > 0 && (
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <div className="fw-bold fs-1">{props.animalsNumber}</div>
              <div className="fw-medium text-muted">Animais</div>
            </Col>
          )}
          {props.disabledNumber > 0 && (
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <div className="fw-bold fs-1">{props.disabledNumber}</div>
              <div className="fw-medium text-muted">PCD</div>
            </Col>
          )}
        </Row>

        <Row>
          {props.latitude && props.longitude && (
            <Col className="d-flex pb-2 pb-lg-0" xs={12} lg={6}>
              <Button
                as="a"
                variant="primary"
                target="_blank"
                size="lg"
                className="d-flex align-items-center justify-content-center flex-fill fw-medium"
                href={`https://www.google.com/maps/place/${props.latitude},${props.longitude}`}
                disabled={loading}
              >
                <Icon path={mdiMapMarker} size={1} className="me-2" /> Mapa
              </Button>
            </Col>
          )}
          {props.cellphone && (
            <>
              <Col className="d-flex" xs={6} lg={3}>
                <Button
                  as="a"
                  variant="info"
                  target="_blank"
                  size="lg"
                  className="d-flex align-items-center justify-content-center flex-fill fw-medium"
                  href={`tel:${props.cellphone}`}
                  disabled={loading}
                >
                  <Icon path={mdiCellphone} size={1} className="me-2" /> Celular
                </Button>
              </Col>
              <Col className="d-flex" xs={6} lg={3}>
                <Button
                  as="a"
                  variant="success"
                  target="_blank"
                  size="lg"
                  className="d-flex align-items-center justify-content-center flex-fill fw-medium"
                  href={`https://wa.me/55${props.cellphone}`}
                  disabled={loading}
                >
                  <Icon path={mdiWhatsapp} size={1} className="me-2" /> Whats
                </Button>
              </Col>
            </>
          )}
        </Row>
        <Row>
          {props.confirm && (
            <Col className="d-flex gap-2">
              <Button
                as="button"
                variant="dark"
                size="lg"
                className="d-flex align-items-center justify-content-center flex-fill fw-medium"
                onClick={() => {
                  setModal(true);
                }}
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" className="me-2" />
                ) : (
                  <Icon path={mdiCheck} size={1} className="me-2" />
                )}
                Concluir Resgate
              </Button>
            </Col>
          )}
          {props.rescued === false && (
            <Badge bg={"warning"} className="fs-6">
              Pendente
            </Badge>
          )}
          {props.rescued === true && (
            <Badge bg={"success"} className="fs-6">
              Realizado
            </Badge>
          )}
        </Row>
      </div>

      <Modal
        centered={true}
        show={modal}
        onHide={() => {
          setModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar o Resgate</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="fs-4 text-center">
            Você está confirmando que o resgate foi realizado e não precisa mais
            de ajuda.
            <br />
            Confirma essa ação?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant={"primary"}
            className="w00"
            onClick={() => {
              handleConfirm();
            }}
          >
            Confirmar
          </Button>
          <Button
            variant={"dark"}
            className="w00"
            onClick={() => {
              setModal(false);
            }}
          >
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
    </ListGroup.Item>
  );
}
