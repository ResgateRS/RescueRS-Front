import React, { Suspense, lazy } from 'react';
import { useLocation, useRoutes } from 'react-router-dom';

const Login = lazy(()=> import("./screens/Login"));
const SolicitarResgate = lazy(()=> import("./screens/SolicitarResgate"));
const MinhasSolicitacoes = lazy(()=> import("./screens/MinhasSolicitacoes"));
const Resgates = lazy(()=> import("./screens/Resgates"));

import 'bootstrap/dist/css/bootstrap.min.css';
import AuthProvider from './context/AuthContext';

function App() {
    
    const element = useRoutes([
        {path: "/", element: <Login />},
        {path: "/solicitarResgate", element: <SolicitarResgate />},
        {path: "/minhasSolicitacoes", element: <MinhasSolicitacoes />},
        {path: "/resgates", element: <Resgates />},
    ]);

    const location = useLocation();

    if(!element) return null;

    return (
        <Suspense fallback={<>Carregando...</>}>
            <AuthProvider>
                {React.cloneElement(element, {key: location.pathname})}
            </AuthProvider>
        </Suspense>
    )
}

export default App
