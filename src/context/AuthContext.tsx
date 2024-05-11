import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Position } from "../config/define";

type AuthContextProps = {
  cellphone: string | undefined;
  token: string | undefined;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  rescuer: boolean | undefined;
  setRescuer: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  position: Position | null;
  setAuth: (token?: string, rescuer?: boolean, cellphone?: string) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function useAuth() {
  return useContext(AuthContext);
}

const saveAuthToStorage = (
  token?: string,
  rescuer?: boolean,
  cellphone?: string,
) => {
  const auth = { token, rescuer, cellphone };
  localStorage.setItem("auth", JSON.stringify(auth));
};

const getAuthFromStorage = () => {
  const auth = localStorage.getItem("auth");
  return auth
    ? JSON.parse(auth)
    : { token: undefined, rescuer: undefined, cellphone: undefined };
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const [cellphone, setCellphone] = useState<string>();
  const [token, setToken] = useState<string>();
  const [rescuer, setRescuer] = useState<boolean>();
  const [position, setPosition] = useState<Position | null>(null);

  const setAuth = (token?: string, rescuer?: boolean, cellphone?: string) => {
    setToken(token);
    setRescuer(!!rescuer);
    setCellphone(cellphone);
    saveAuthToStorage(token, rescuer, cellphone);
  };

  useEffect(() => {
    function handleLocation() {
      navigator.geolocation.getCurrentPosition((newPosition) => {
        const lat = newPosition.coords.latitude;
        const lng = newPosition.coords.longitude;
        if (position?.lat === lat && position?.lng === lng) return;
        setPosition({ lat, lng });
      });
    }

    handleLocation();

    const intervalLocation = setInterval(
      () => {
        handleLocation();
      },
      rescuer ? 1000 * 60 : 5000,
    );

    const auth = getAuthFromStorage();
    setToken(auth.token);
    setRescuer(auth.rescuer);
    setCellphone(auth.cellphone);
    setLoading(false);

    return () => {
      clearInterval(intervalLocation);
    };
  }, [rescuer]);

  if (loading) return null;

  const value = {
    cellphone,
    token,
    setToken,
    rescuer,
    setRescuer,
    position,
    setAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
