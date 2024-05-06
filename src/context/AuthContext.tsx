import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type AuthContextProps = {
	token: string | undefined;
	setToken: React.Dispatch<React.SetStateAction<string | undefined>>;
	rescuer: boolean | undefined;
	setRescuer: React.Dispatch<React.SetStateAction<boolean | undefined>>;
	latitude: number | undefined;
	longitude: number | undefined;
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
	const [latitude, setLatitude] = useState<number>();
	const [longitude, setLongitude] = useState<number>();

	useEffect(()=>{
		navigator.geolocation.getCurrentPosition((position) => {
			let lat = position.coords.latitude;
			let long = position.coords.longitude;
		
			setLatitude(lat);
			setLongitude(long);
		});
	},[])

	const value = {
		token,
		setToken,
		rescuer,
		setRescuer,
		latitude,
		longitude,
	}

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	)

}