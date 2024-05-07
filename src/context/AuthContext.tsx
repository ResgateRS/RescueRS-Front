import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthContextProps = {
  token: string | undefined;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  rescuer: boolean | undefined;
  setRescuer: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  latitude: number | undefined;
  longitude: number | undefined;
  setAuth: (token: string, rescuer: boolean) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function useAuth() {
  return useContext(AuthContext);
}

const saveAuthToStorage = (token: string, rescuer: boolean) => {
  const auth = { token, rescuer };
  localStorage.setItem("auth", JSON.stringify(auth));
};

const getAuthFromStorage = () => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth) : { token: undefined, rescuer: undefined };
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string>();
  const [rescuer, setRescuer] = useState<boolean>();
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();

  const setAuth = (token: string, rescuer: boolean) => {
    setToken(token);
    setRescuer(rescuer);
    saveAuthToStorage(token, rescuer);
  };

  useEffect(() => {
    const auth = getAuthFromStorage();
    setToken(auth.token);
    setRescuer(auth.rescuer);
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;

      setLatitude(lat);
      setLongitude(long);
    });
  }, []);

  const value = {
    token,
    setToken,
    rescuer,
    setRescuer,
    latitude,
    longitude,
    setAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
