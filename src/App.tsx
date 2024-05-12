import React, { Suspense, lazy } from "react";
import { useLocation, useRoutes } from "react-router-dom";

const Login = lazy(() => import("./screens/Login"));
const SolicitarResgate = lazy(() => import("./screens/SolicitarResgate"));
const MinhasSolicitacoes = lazy(() => import("./screens/MinhasSolicitacoes"));
const Resgates = lazy(() => import("./screens/Resgates"));

import { AuthProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
import { ConfirmModalProvider } from "./context/ConfirmModal";

function App() {
  const element = useRoutes([
    { path: "/", element: <Login /> },
    { path: "/minhasSolicitacoes", element: <MinhasSolicitacoes /> },
    { path: "/resgates", element: <Resgates /> },
    { path: "/solicitarResgate", element: <SolicitarResgate /> },
  ]);

  const location = useLocation();

  if (!element) return null;

  return (
    <Suspense
      fallback={
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "100dvh" }}
        >
          <Spinner /> Carregando...
        </div>
      }
    >
      <AuthProvider>
        <ConfirmModalProvider>
          {React.cloneElement(element, { key: location.pathname })}
        </ConfirmModalProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
