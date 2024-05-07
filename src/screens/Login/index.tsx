import { useState } from "react";
import { Alert, Button, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";
import parsePhoneNumber from "libphonenumber-js";
import { PhoneNumberFormControl } from "../../components/PhoneNumberFormControl";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [phoneNumberError, setPhoneNumberError] = useState<string>();
  const [apiError, setApiError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const error = phoneNumberError ?? apiError;

  function handlePhoneNumberChange(value?: string) {
    if (!value?.length) {
      return setPhoneNumberError("Número de celular obrigatório");
    }
    const parsedPhoneNumber = parsePhoneNumber(value, "BR");
    if (!parsedPhoneNumber?.isValid()) {
      return setPhoneNumberError("Número de celular inválido");
    }
    setPhoneNumberError(undefined);
    setPhoneNumber(value);
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
    const body = (await resp.json()) as APIResponse;
	setLoading(false);
    return { status: resp.ok, body: body };
  }

  async function handleSolicitarResgate() {
    const resp = await handleLogin(false);
    if (resp.status && resp.body.Result === 1) {
      setAuth(resp.body.Data.token, resp.body.Data.rescuer);
      navigate("minhasSolicitacoes");
    } else {
      setApiError(
        resp.body.Message ?? "Ocorreu algum problema, tente novamente"
      );
    }
  }

  async function handleEstouResgatando() {
    const resp = await handleLogin(false);
    if (resp.status) {
      setAuth(resp.body.Data.token, resp.body.Data.rescuer);
      navigate("resgates");
    } else {
      setApiError("Ocorreu algum problema, tente novamente");
    }
  }

  return (
    <Layout>
      	<Header />

		<h4 className="mb-4">Acesso ao sistema</h4>

      <Card className="w-100 shadow-sm">
        <Card.Body>
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
              className="mb-4 w-100 text-uppercase py-3"
              size="lg"
              onClick={handleSolicitarResgate}
			  disabled={loading}
            >
              {loading && <Spinner size="sm" className="me-2"/>} Solicitar Resgate
            </Button>

            <Button
              variant="dark"
              className="mb-4 w-100 text-uppercase py-3"
              size="lg"
              onClick={handleEstouResgatando}
			  disabled={loading}
            >
              {loading && <Spinner size="sm" className="me-2"/>} Estou Resgatando
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
}
