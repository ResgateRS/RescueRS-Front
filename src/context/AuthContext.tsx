import { ReactNode, createContext, useContext, useState } from "react";

type AuthContextProps = {
	token: string | undefined;
	setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
	rescuer: boolean | undefined;
	setRescuer: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}

type AuthProviderProps = {
	children: ReactNode;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function useAuth(){
	return useContext(AuthContext);
}

export default function AuthProvider({children}: AuthProviderProps){

	const [token, setToken] = useState<string>();
	const [rescuer, setRescuer] = useState<boolean>();

	const value = {
		token,
		setToken,
		rescuer,
		setRescuer
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)

}