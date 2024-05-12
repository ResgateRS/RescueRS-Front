import ListGroup from "react-bootstrap/ListGroup";
import Icon from "@mdi/react";
import clsx from "clsx";
import {
  mdiCancel,
  mdiCellphone,
  mdiCheck,
  mdiClockOutline,
  mdiMapMarker,
  mdiMapMarkerOutline,
  mdiWhatsapp,
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
import { useConfirmModal } from "../../context/ConfirmModal";
import haversine from "haversine";

enum RescueStatus {
  Pending = 0,
  Started = 1,
  Completed = 2,
}

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
  status?: RescueStatus;
  isRescuer?: boolean;
  startedByMe?: boolean;
  refreshData?: () => void;
};

const queryClient = new QueryClient();

enum RescueAction {
  Confirm = "Confirm",
  Cancel = "Cancel",
  Start = "Start",
}

export default function RestageItem(props: RestageItemProps) {
  const { token, position } = useAuth();
  const { post } = useApi();
  const { openModal } = useConfirmModal();

  const [loading, setLoading] = useState(false);
  const [removed, setRemoved] = useState(false);

  async function handleAction(action: RescueAction) {
    setLoading(true);
    const data: APIConfirmRequest = {
      rescueId: props.rescueId,
    };

    const resp = await post<APIConfirmRequest, APIResponse>(
      `${import.meta.env.VITE_API_URL}/Rescue/${action}`,
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
    <ListGroup.Item
      variant={
        clsx({
          primary: props.status === RescueStatus.Started && props.startedByMe,
          success: props.status === RescueStatus.Completed,
        }) || "light"
      }
      className="rounded border "
    >
      <div className="d-flex flex-column gap-2">
        <Row>
          <Col>
            <div className="d-flex align-items-center text-muted justify-content-start">
              <Icon path={mdiClockOutline} size={0.7} className="me-1" />
              {moment(props.requestDateTime).locale("pt-br").fromNow()}
            </div>
          </Col>

          <Col>
            <div className="d-flex flex-column flex-sm-row gap-2 align-items-end text-muted justify-content-end">
              {props.status === RescueStatus.Pending && (
                <Badge pill bg="warning" className="fs-6">
                  pendente
                </Badge>
              )}
              {props.status === RescueStatus.Started && (
                <Badge
                  pill
                  bg={props.startedByMe ? "primary" : "secondary"}
                  className="fs-6"
                >
                  {props.startedByMe ? "você iniciou" : "em andamento"}
                </Badge>
              )}
              {props.status === RescueStatus.Completed && (
                <Badge pill bg="success" className="fs-6">
                  finalizado
                </Badge>
              )}
              {props.distance && (
                <div>
                  <Icon
                    path={mdiMapMarkerOutline}
                    size={0.7}
                    className="me-1"
                  />
                  {position &&
                    formatarDistancia(
                      haversine(
                        { latitude: position.lat, longitude: position.lng },
                        {
                          latitude: props.latitude!,
                          longitude: props.longitude!,
                        },
                        { unit: "meter" },
                      ),
                    )}
                </div>
              )}
            </div>
          </Col>
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
          {props.latitude && props.longitude ? (
            <Col className="d-flex pb-2 pb-lg-0" xs={12} sm={12} lg={6}>
              <Button
                as="a"
                variant="outline-primary"
                target="_blank"
                size="lg"
                className="d-flex align-items-center justify-content-center flex-fill fw-medium"
                href={`https://www.google.com/maps/place/${props.latitude},${props.longitude}`}
                disabled={loading}
              >
                <Icon path={mdiMapMarker} size={1} className="me-2" /> Mapa
              </Button>
            </Col>
          ) : null}
          {props.cellphone && (
            <>
              <Col className="d-flex pb-2 pb-sm-0" xs={12} sm={6} lg={3}>
                <Button
                  as="a"
                  variant="outline-dark"
                  target="_blank"
                  size="lg"
                  className="d-flex align-items-center justify-content-center flex-fill fw-medium"
                  href={`tel:${props.cellphone}`}
                  disabled={loading}
                >
                  <Icon path={mdiCellphone} size={1} className="me-2" /> Celular
                </Button>
              </Col>
              <Col className="d-flex" xs={12} sm={6} lg={3}>
                <Button
                  as="a"
                  variant="outline-success"
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
        {props.isRescuer && (
          <Row>
            {props.status === RescueStatus.Pending && (
              <Col className="d-flex">
                <Button
                  as="button"
                  variant="dark"
                  size="lg"
                  className="d-flex align-items-center justify-content-center flex-fill fw-medium"
                  onClick={async () => {
                    const confirm = await openModal({
                      title: "Iniciar o resgate",
                      message: (
                        <>
                          Você está confirmando que irá realizar o resgate.
                          <br />
                          Confirma essa ação?
                        </>
                      ),
                      confirmButtonText: "Iniciar",
                    });
                    if (confirm) {
                      handleAction(RescueAction.Start).then(props.refreshData);
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner size="sm" className="me-2" />
                  ) : (
                    <Icon path={mdiCheck} size={1} className="me-2" />
                  )}
                  Iniciar resgate
                </Button>
              </Col>
            )}

            {props.status === RescueStatus.Started && (
              <>
                <Col className="d-flex pb-2 pb-sm-0" xs={12} sm={6}>
                  <Button
                    as="button"
                    variant="outline-danger"
                    size="lg"
                    className="d-flex align-items-center justify-content-center flex-fill fw-medium"
                    onClick={async () => {
                      const confirm = await openModal({
                        title: "Cancelar regate",
                        message: (
                          <>
                            O resgate voltará à lista de pendentes.
                            <br />
                            Confirma essa ação?
                          </>
                        ),
                        confirmButtonText: "Cancelar resgate",
                        cancelButtonText: "Manter",
                        isDanger: true,
                      });
                      if (confirm) {
                        handleAction(RescueAction.Cancel);
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner size="sm" className="me-2" />
                    ) : (
                      <Icon path={mdiCancel} size={1} className="me-2" />
                    )}
                    Cancelar
                  </Button>
                </Col>
                <Col className="d-flex" xs={12} sm={6}>
                  <Button
                    as="button"
                    variant="success"
                    size="lg"
                    className="d-flex align-items-center justify-content-center flex-fill fw-medium"
                    onClick={async () => {
                      const confirm = await openModal({
                        title: "Confirmar resgate",
                        message: (
                          <>
                            O resgate será marcado como finalizado.
                            <br />
                            Confirma essa ação?
                          </>
                        ),
                      });
                      if (confirm) {
                        handleAction(RescueAction.Confirm).then(
                          props.refreshData,
                        );
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner size="sm" className="me-2" />
                    ) : (
                      <Icon path={mdiCheck} size={1} className="me-2" />
                    )}
                    Concluir
                  </Button>
                </Col>
              </>
            )}
          </Row>
        )}
      </div>
    </ListGroup.Item>
  );
}
