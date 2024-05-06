import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import { useAuth } from "../../context/AuthContext";

export default function Login(){

	const navigate = useNavigate();
	const {setToken, setRescuer} = useAuth();

	const [celular, setCelular] = useState("");
	const [error, setError] = useState("");

	async function handleLogin(rescuer: boolean){
		setError("");
		const resp = await fetch(`${import.meta.env.VITE_API_URL}/Login`,{ headers: {"Content-Type": "application/json"}, method: "POST", body: JSON.stringify({"cellphone": celular, "rescuer": rescuer}) });
		const body = await resp.json();
		return {status: resp.ok, body: body};
	}

	async function handleSolicitarResgate(){
		let resp = await handleLogin(false);
		if(resp.status){
			setToken(resp.body.token)
			setRescuer(resp.body.rescuer)
			navigate("minhasSolicitacoes");
		}else{
			setError("Ocorreu algum problema, tente novamente");
		}
	}

	async function handleEstouResgatando(){
		let resp = await handleLogin(false);
		if(resp.status){
			setToken(resp.body.token)
			setRescuer(resp.body.rescuer)
			navigate("resgates");
		}else{
			setError("Ocorreu algum problema, tente novamente");
		}
	}

	return (
		<Layout>
			<Header/>
			
			<Card className="w-100 shadow-sm">
				<Card.Body>
					<Form>
						<Form.Group className="mb-4">
							<Form.Label>Celular</Form.Label>
							<Form.Control type="number" placeholder="Informe aqui o celular" size="lg" className="" value={celular} onChange={(e)=>{ setCelular(e.currentTarget.value) }} />
						</Form.Group>

						{error!="" && (
							<Alert variant="danger">{error}</Alert>
						)}

						<Button className="mb-4 w-100 text-uppercase py-3" size="lg" onClick={handleSolicitarResgate}>Solicitar Resgate</Button>

						<Button variant="dark" className="mb-4 w-100 text-uppercase py-3" size="lg" onClick={handleEstouResgatando}>Estou Resgatando</Button>
					</Form>
				</Card.Body>
			</Card>
		</Layout>
	)
}