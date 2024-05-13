import { mdiHandHeartOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const { token, cellphone, setAuth } = useAuth();

  function handleSair() {
    setAuth(undefined, undefined, undefined);
    navigate("/");
  }

  return (
    <div className="d-flex flex-row align-items-center justify-content-between px-2 my-2">
      <div
        className="d-flex flex-row align-items-center justify-content-start text-white p-2 rounded-3"
        style={{
          background: "linear-gradient(90deg, #ED8445, #FE3431)",
        }}
      >
        <Icon path={mdiHandHeartOutline} size={1.5} className="me-2" />
        <h2 className="my-0">Resgate RS</h2>
      </div>
      <div className="d-flex align-items-center justify-content-end">
        {cellphone}
        {token && (
          <Button variant="outline-dark" className="ms-2" onClick={handleSair}>
            Sair
          </Button>
        )}
      </div>
    </div>
  );
}
