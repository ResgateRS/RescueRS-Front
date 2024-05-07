import { Container } from "react-bootstrap";

export default function Layout({children}: any){

	return (
		<Container className="d-flex flex-column">
			{children}
		</Container>
	)
}