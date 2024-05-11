import { createContext, useContext } from "react";
import { Position } from "../../config/define";

export type AuthContextProps = {
  cellphone: string | undefined;
  token: string | undefined;
  setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
  rescuer: boolean | undefined;
  setRescuer: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  position: Position | null;
  setAuth: (token?: string, rescuer?: boolean, cellphone?: string) => void;
};

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps,
);

export function useAuth() {
  return useContext(AuthContext);
}
