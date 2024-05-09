import { mdiHandHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Button, Col, Row } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { token, setAuth } = useAuth();

  function handleSair() {
    setAuth(undefined, undefined);
    navigate("/");
  }

  return (
    <Row className="d-flex flex-row align-items-center justify-content-between my-4">
      <Col xs={3}></Col>
      <Col
        xs={6}
        className="d-flex flex-row align-items-center justify-content-center"
      >
        <Icon path={mdiHandHeartOutline} size={1.5} className="me-3" />
        <h2 className="my-0">Resgate RS</h2>
      </Col>
      <Col xs={3} className="d-flex  justify-content-end ">
        {token && (
          <Button variant="outline-dark" className="ms-4" onClick={handleSair}>
            Sair
          </Button>
        )}
      </Col>
    </Row>
  );
}
