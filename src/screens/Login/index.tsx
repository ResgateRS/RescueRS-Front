import { useEffect, useState } from "react";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import parsePhoneNumber from "libphonenumber-js";
import { PhoneNumberFormControl } from "../../components/PhoneNumberFormControl";
import { APIResponseLogin } from "../../config/define";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth, token, rescuer } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [phoneNumberError, setPhoneNumberError] = useState<string>();
  const [apiError, setApiError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const error = phoneNumberError ?? apiError;

  useEffect(() => {
    if (token) {
      navigate(rescuer ? "/resgates" : "/minhasSolicitacoes");
    }
  }, [token]);

  function handlePhoneNumberChange(value?: string) {
    setPhoneNumber(value);
    if (!value?.length) {
      return setPhoneNumberError("Número de celular obrigatório");
    }
    const parsedPhoneNumber = parsePhoneNumber(value, "BR");
    if (!parsedPhoneNumber?.isValid()) {
      return setPhoneNumberError("Número de celular inválido");
    }
    setPhoneNumberError(undefined);
  }

  async function handleLogin(rescuer: boolean) {
    setLoading(true);
    setApiError(undefined);
    const parsedPhoneNumber = parsePhoneNumber(phoneNumber!, "BR");
    const cellphone = parsedPhoneNumber!.nationalNumber;
    const input = { cellphone, rescuer };
    const resp = await fetch(`${import.meta.env.VITE_API_URL}/Login`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(input),
    });
    const body = (await resp.json()) as APIResponseLogin;
    setLoading(false);
    return { status: resp.ok, body: body };
  }

  async function handleSolicitarResgate() {
    const resp = await handleLogin(false);
    if (resp.status && resp.body.Result === 1) {
      setAuth(resp.body.Data?.token, false);
      navigate("minhasSolicitacoes");
    } else {
      setApiError(
        resp.body.Message ?? "Ocorreu algum problema, tente novamente",
      );
    }
  }

  async function handleEstouResgatando() {
    const resp = await handleLogin(false);
    if (resp.status) {
      setAuth(resp.body.Data?.token, true);
      navigate("resgates");
    } else {
      setApiError("Ocorreu algum problema, tente novamente");
    }
  }

  return (
    <Layout>
      <h5 className="mb-4">Acesso ao sistema</h5>

      <Form>
        <Form.Group className="mb-4">
          <Form.Label>Celular</Form.Label>
          <PhoneNumberFormControl
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </Form.Group>
        {!!error && <Alert variant="danger">{error}</Alert>}
        <Button
          className="mb-4 w-100 text-uppercase py-3 fw-medium"
          size="lg"
          onClick={handleSolicitarResgate}
          disabled={loading || !phoneNumber || !!phoneNumberError}
        >
          {loading && <Spinner size="sm" className="me-2" />} Solicitar Resgate
        </Button>
        <div className="d-flex align-items-center mb-4">
          <hr className="flex-fill me-2" />
          ou
          <hr className="flex-fill ms-2" />
        </div>
        <Button
          variant="dark"
          className="mb-4 w-100 text-uppercase py-3 fw-medium"
          size="lg"
          onClick={handleEstouResgatando}
          disabled={loading || !phoneNumber || !!phoneNumberError}
        >
          {loading && <Spinner size="sm" className="me-2" />} Estou Resgatando
        </Button>
      </Form>
    </Layout>
  );
}
