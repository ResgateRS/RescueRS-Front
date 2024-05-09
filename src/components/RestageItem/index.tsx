import ListGroup from "react-bootstrap/ListGroup";
import Icon from "@mdi/react";
import {
  mdiCellphone,
  mdiCheck,
  mdiClockOutline,
  mdiMapMarker,
  mdiMapMarkerOutline,
} from "@mdi/js";
import { Badge, Button, Col, Row, Spinner } from "react-bootstrap";
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
  const [removed, setRemoved] = useState(false);

  async function handleConfirm() {
    setLoading(true);
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
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <div className="fw-bold fs-1">{props.adultsNumber}</div>
            <div className="text-muted">Adultos</div>
          </Col>
          {props.childrenNumber > 0 && (
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <div className="fw-bold fs-4">{props.childrenNumber}</div>
              <div className="text-muted">Crianças</div>
            </Col>
          )}
          {props.elderlyNumber > 0 && (
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <div className="fw-bold fs-4">{props.elderlyNumber}</div>
              <div className="text-muted">Idosos</div>
            </Col>
          )}
          {props.animalsNumber > 0 && (
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <div className="fw-bold fs-4">{props.animalsNumber}</div>
              <div className="text-muted">Animais</div>
            </Col>
          )}
          {props.disabledNumber > 0 && (
            <Col className="d-flex flex-column justify-content-center align-items-center">
              <div className="fw-bold fs-4">{props.disabledNumber}</div>
              <div className="text-muted">PCD</div>
            </Col>
          )}
        </Row>

        <div className="d-flex gap-2">
          {props.latitude && props.longitude && (
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
          )}
          {props.cellphone && (
            <Button
              as="a"
              variant="primary"
              target="_blank"
              size="lg"
              className="d-flex align-items-center justify-content-center flex-fill fw-medium"
              href={`tel:${props.cellphone}`}
              disabled={loading}
            >
              <Icon path={mdiCellphone} size={1} className="me-2" /> Celular
            </Button>
          )}
        </div>
        {props.confirm && (
          <Button
            as="button"
            variant="dark"
            size="lg"
            className="d-flex align-items-center justify-content-center flex-fill fw-medium"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <Spinner size="sm" className="me-2" />
            ) : (
              <Icon path={mdiCheck} size={1} className="me-2" />
            )}
            Confirmar
          </Button>
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
      </div>
    </ListGroup.Item>
  );
}
