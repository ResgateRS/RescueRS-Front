import { useEffect, useState } from "react";
import { Position } from "../../config/define";
import { AuthContext } from "./context";

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

const getLocation = (): Promise<Position | null> => {
  let position: Position | null = null;
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (newPosition) => {
        const lat = newPosition.coords.latitude;
        const lng = newPosition.coords.longitude;
        position = { lat, lng };
        resolve(position);
      },
      (error) => {
        console.warn("Error getting location", error);
        resolve(null);
      },
    );
  });
};

export function AuthProvider({ children }: React.PropsWithChildren) {
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
    async function handleLocation() {
      const position = await getLocation();
      setPosition(position);
    }

    handleLocation();

    const intervalLocation = setInterval(
      () => {
        handleLocation();
      },
      rescuer ? 1000 * 30 : 1000 * 5,
    );
    return () => {
      clearInterval(intervalLocation);
    };
  }, [rescuer]);

  useEffect(() => {
    const auth = getAuthFromStorage();
    setToken(auth.token);
    setRescuer(auth.rescuer);
    setCellphone(auth.cellphone);
    setLoading(false);
  }, []);

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
