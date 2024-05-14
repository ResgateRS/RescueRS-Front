import { useState } from "react";
import {
  Button,
  Form,
  Alert,
  InputGroup,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import Icon from "@mdi/react";
import { mdiChevronLeft, mdiMinus, mdiPlus } from "@mdi/js";

import Layout from "../../components/Layout";
import { Link, useNavigate } from "react-router-dom";
import {
  APIRequestRequest,
  APIResponse,
  Position,
  queryClient,
} from "../../config/define";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/api";
import { LocationInput } from "../../components/LocationInput";
import { PhoneNumberFormControl } from "../../components/PhoneNumberFormControl";
import { parsePhoneNumber } from "libphonenumber-js";

export default function SolicitarResgate() {
  const navigate = useNavigate();
  const { cellphone, token, position: userPosition } = useAuth();
  const { post } = useApi();

  const [contactPhone, setContactPhone] = useState<string>(cellphone || "");
  const [adultsNumber, setAdultsNumber] = useState<number>(0);
  const [childrenNumber, setChildrenNumber] = useState<number>(0);
  const [elderlyNumber, setElderlyNumber] = useState<number>(0);
  const [disabledNumber, setDisabledNumber] = useState<number>(0);
  const [animalsNumber, setAnimalsNumber] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState<Position | null>(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  async function handleSolicitarResgate() {
    if (!position) {
      setError("Informe a localização");
      return;
    }

    setError("");
    setLoading(true);

    const parsedPhoneNumber = parsePhoneNumber(contactPhone!, "BR");
    const cellphone = parsedPhoneNumber!.nationalNumber;

    const data: APIRequestRequest = {
      contactPhone: cellphone,
      adultsNumber: adultsNumber,
      childrenNumber: childrenNumber,
      elderlyNumber: elderlyNumber,
      disabledNumber: disabledNumber,
      animalsNumber: animalsNumber,
      latitude: position?.lat ?? 0,
      longitude: position?.lng ?? 0,
      description: description,
    };

    const resp = await post<APIRequestRequest, APIResponse>(
      `${import.meta.env.VITE_API_URL}/Rescue/Request`,
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
        queryKey: ["ListMyRescues"],
      });
      queryClient.resetQueries();
      setShow(true);
      setMessage(resp.Message);
    } else {
      setError(resp.Message ?? "Ocorreu algum problema, tente novamente");
      setLoading(false);
    }
  }

  function handleVoltar() {
    navigate("/minhasSolicitacoes");
  }

  return (
    <Layout>
      <Link
        className="h5 text-decoration-none mb-4 d-flex align-items-center"
        to={"/minhasSolicitacoes"}
      >
        <Icon path={mdiChevronLeft} size={1} className="me-2" />
        Solicitar Resgate
      </Link>

      <Form className="w-100">
        <Form.Group className="mb-3 ">
          <Form.Label>Telefone para Contato</Form.Label>
          <PhoneNumberFormControl
            value={contactPhone}
            onChange={(value) => {
              setContactPhone(value || "");
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3 ">
          <Form.Label>Número de adultos</Form.Label>
          <InputGroup>
            <Form.Control
              type="number"
              min={0}
              placeholder="Informe aqui o número de adultos"
              size="lg"
              className=""
              value={adultsNumber}
              onChange={(e) => {
                setAdultsNumber(Number(e.currentTarget.value));
              }}
            />
            <Button
              variant="danger"
              onClick={() => {
                setAdultsNumber((p) => (p == 0 ? 0 : p - 1));
              }}
            >
              <Icon path={mdiMinus} size={1} />
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setAdultsNumber((p) => p + 1);
              }}
            >
              <Icon path={mdiPlus} size={1} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3 ">
          <Form.Label>Número de crianças</Form.Label>
          <InputGroup>
            <Form.Control
              type="number"
              min={0}
              placeholder="Informe aqui o número de crianças"
              size="lg"
              className=""
              value={childrenNumber}
              onChange={(e) => {
                setChildrenNumber(Number(e.currentTarget.value));
              }}
            />
            <Button
              variant="danger"
              onClick={() => {
                setChildrenNumber((p) => (p == 0 ? 0 : p - 1));
              }}
            >
              <Icon path={mdiMinus} size={1} />
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setChildrenNumber((p) => p + 1);
              }}
            >
              <Icon path={mdiPlus} size={1} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3 ">
          <Form.Label>Número de idosos</Form.Label>
          <InputGroup>
            <Form.Control
              type="number"
              min={0}
              placeholder="Informe aqui o número de idosos"
              size="lg"
              className=""
              value={elderlyNumber}
              onChange={(e) => {
                setElderlyNumber(Number(e.currentTarget.value));
              }}
            />
            <Button
              variant="danger"
              onClick={() => {
                setElderlyNumber((p) => (p == 0 ? 0 : p - 1));
              }}
            >
              <Icon path={mdiMinus} size={1} />
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setElderlyNumber((p) => p + 1);
              }}
            >
              <Icon path={mdiPlus} size={1} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3 ">
          <Form.Label>Número de pessoas com deficiência</Form.Label>
          <InputGroup>
            <Form.Control
              type="number"
              min={0}
              placeholder="Informe aqui o número de pessoas com deficiência"
              size="lg"
              className=""
              value={disabledNumber}
              onChange={(e) => {
                setDisabledNumber(Number(e.currentTarget.value));
              }}
            />
            <Button
              variant="danger"
              onClick={() => {
                setDisabledNumber((p) => (p == 0 ? 0 : p - 1));
              }}
            >
              <Icon path={mdiMinus} size={1} />
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setDisabledNumber((p) => p + 1);
              }}
            >
              <Icon path={mdiPlus} size={1} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3 ">
          <Form.Label>Número de Animais</Form.Label>
          <InputGroup>
            <Form.Control
              type="number"
              min={0}
              placeholder="Informe aqui o número de Animais"
              size="lg"
              className=""
              value={animalsNumber}
              onChange={(e) => {
                setAnimalsNumber(Number(e.currentTarget.value));
              }}
            />
            <Button
              variant="danger"
              onClick={() => {
                setAnimalsNumber((p) => (p == 0 ? 0 : p - 1));
              }}
            >
              <Icon path={mdiMinus} size={1} />
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setAnimalsNumber((p) => p + 1);
              }}
            >
              <Icon path={mdiPlus} size={1} />
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="mb-3 ">
          <Form.Label>Descrição / Observação</Form.Label>
          <Form.Control
            as={"textarea"}
            type="text"
            placeholder="Informe aqui uma breve descrição / observação sobre o resgate"
            size="lg"
            rows={3}
            maxLength={500}
            value={description}
            onChange={(e) => {
              setDescription(e.currentTarget.value);
            }}
          />
        </Form.Group>

        <LocationInput
          currentUserPosition={userPosition}
          onChange={setPosition}
        />

        {error != "" && <Alert variant="danger">{error}</Alert>}

        <Button
          className="w-100 text-uppercase py-3 fw-medium"
          size="lg"
          onClick={handleSolicitarResgate}
          disabled={loading}
        >
          Solicitar
        </Button>

        <ToastContainer
          className="p-3 position-fixed"
          position={"bottom-center"}
          style={{ zIndex: 10 }}
        >
          <Toast onClose={handleVoltar} show={show}>
            <Toast.Header>
              <strong className="me-auto">Solicitar Resgate</strong>
            </Toast.Header>
            <Toast.Body className="bg-white">
              <div className="fs-5 mb-3 text-center">{message}</div>
              <Button className="w-100" onClick={handleVoltar}>
                Fechar
              </Button>
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Form>
    </Layout>
  );
}
