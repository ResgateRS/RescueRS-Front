import { Button, ListGroup } from "react-bootstrap";


export default function SolicitarResgate(){

	

	function handleSolicitarResgate(){

	}

	return (
		<div className="d-flex flex-column align-items-center justify-content-center">
			<div className="d-flex my-5">
				<h1>Minhas Solicitações</h1>
			</div>

			<Button className="mb-4 w-100 text-uppercase py-3" size="lg" onClick={handleSolicitarResgate}>Solicitar Resgate</Button>

			<ListGroup>
				{}
				<ListGroup.Item action>
					Link 1
				</ListGroup.Item>
			</ListGroup>
		</div>
	)
}