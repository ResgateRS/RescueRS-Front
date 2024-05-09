import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Position } from "../config/define";

type AuthContextProps = {
  token: string | undefined;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  rescuer: boolean | undefined;
  setRescuer: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  position: Position | null;
  setAuth: (token?: string, rescuer?: boolean) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function useAuth() {
  return useContext(AuthContext);
}

const saveAuthToStorage = (token?: string, rescuer?: boolean) => {
  const auth = { token, rescuer };
  localStorage.setItem("auth", JSON.stringify(auth));
};

const getAuthFromStorage = () => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : { token: undefined, rescuer: undefined };
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string>();
  const [rescuer, setRescuer] = useState<boolean>();
  const [position, setPosition] = useState<Position | null>(null);

  const setAuth = (token?: string, rescuer?: boolean) => {
    setToken(token);
    setRescuer(!!rescuer);
    saveAuthToStorage(token, rescuer);
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

    const intervalLocation = setInterval(() => {
      handleLocation();
    }, 5000);

    const auth = getAuthFromStorage();
    setToken(auth.token);
    setRescuer(auth.rescuer);
    setLoading(false);

    return () => {
      clearInterval(intervalLocation);
    };
  }, []);

  if (loading) return null;

  const value = {
    token,
    setToken,
    rescuer,
    setRescuer,
    position,
    setAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
