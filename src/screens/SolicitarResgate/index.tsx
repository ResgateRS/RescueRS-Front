import { useState } from "react";
import { Button, Form, Alert, InputGroup, Card } from "react-bootstrap";
import Icon from '@mdi/react';
import { mdiMinus, mdiPlus } from '@mdi/js';

import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import { OutputFormat, RequestType, geocode } from "react-geocode";

export default function SolicitarResgate(){

	const navigate = useNavigate();

	const [totalPeopleNumber, setTotalPeopleNumber] = useState<number>(0);
	const [childrenNumber, setChildrenNumber] = useState<number>(0);
	const [elderlyNumber, setElderlyNumber] = useState<number>(0);
	const [disabledNumber, setDisabledNumber] = useState<number>(0);
	const [animalsNumber, setAnimalsNumber] = useState<number>(0);
	const [address, setAddress] = useState<string>("");

	const [error, setError] = useState("");

	async function handleSolicitarResgate(){
		let location = await handleLatLong();

		const data = {
			"totalPeopleNumber": totalPeopleNumber,
			"childrenNumber": childrenNumber,
			"elderlyNumber": elderlyNumber,
			"disabledNumber": disabledNumber,
			"animalsNumber": animalsNumber,
			"latitude": location.lat,
			"longitude": location.lng,
		}

		const resp = await fetch(`${import.meta.env.API_URL}/Rescue/Request`, {method: 'post', body: JSON.stringify(data)});
		const body = await resp.json() as APIResponse;
		if(resp.status){
			navigate("/minhasSolicitacoes");
		}else{
			setError("Ocorreu algum problema, tente novamente");
		}
	}

	async function handleLatLong(){
		let resp = await geocode(RequestType.ADDRESS, address, {key: import.meta.env.VITE_MAPS_API, outputFormat: OutputFormat.JSON});
		return location = resp.results[0].geometry.location;
	}

	function handleVolta(){
		navigate("/minhasSolicitacoes");
	}

	return (
		<Layout>
			<div className="d-flex my-4">
				<h1>Solicitar Resgate</h1>
			</div>

			<Card className="w-100 shadow-sm">
				<Card.Body>
					<Form className="w-100">
						<Form.Group  className="mb-3 ">
							<Form.Label>Número de pessoas</Form.Label>
							<InputGroup>
								<Form.Control type="number" placeholder="Informe aqui o número de pessoas" size="lg" className="" value={totalPeopleNumber} onChange={(e)=>{ setTotalPeopleNumber(Number(e.currentTarget.value)) }} />
								<Button variant="danger" onClick={()=>{ setTotalPeopleNumber(p=> p-1) }}><Icon path={mdiMinus} size={1}/></Button>
								<Button variant="primary" onClick={()=>{ setTotalPeopleNumber(p=> p+1) }}><Icon path={mdiPlus} size={1}/></Button>
							</InputGroup>
						</Form.Group>

						<Form.Group className="mb-3 ">
							<Form.Label>Número de crianças</Form.Label>
							<InputGroup>
								<Form.Control type="number" placeholder="Informe aqui o número de crianças" size="lg" className="" value={childrenNumber} onChange={(e)=>{ setChildrenNumber(Number(e.currentTarget.value)) }} />
								<Button variant="danger" onClick={()=>{ setChildrenNumber(p=>  p-1) }}><Icon path={mdiMinus} size={1}/></Button>
								<Button variant="primary" onClick={()=>{ setChildrenNumber(p=> p+1) }}><Icon path={mdiPlus} size={1}/></Button>
							</InputGroup>
						</Form.Group>

						<Form.Group className="mb-3 ">
							<Form.Label>Número de idosos</Form.Label>
							<InputGroup>
								<Form.Control type="number" placeholder="Informe aqui o número de idosos" size="lg" className="" value={elderlyNumber} onChange={(e)=>{ setElderlyNumber(Number(e.currentTarget.value)) }} />
								<Button variant="danger" onClick={()=>{ setElderlyNumber(p=>  p-1) }}><Icon path={mdiMinus} size={1}/></Button>
								<Button variant="primary" onClick={()=>{ setElderlyNumber(p=> p+1) }}><Icon path={mdiPlus} size={1}/></Button>
							</InputGroup>
						</Form.Group>

						<Form.Group className="mb-3 ">
							<Form.Label>Número de pessoas desabilitadas</Form.Label>
							<InputGroup>
								<Form.Control type="number" placeholder="Informe aqui o número de pessoas desabilitadas" size="lg" className="" value={disabledNumber} onChange={(e)=>{ setDisabledNumber(Number(e.currentTarget.value)) }} />
								<Button variant="danger" onClick={()=>{ setDisabledNumber(p=>  p-1) }}><Icon path={mdiMinus} size={1}/></Button>
								<Button variant="primary" onClick={()=>{ setDisabledNumber(p=> p+1) }}><Icon path={mdiPlus} size={1}/></Button>
							</InputGroup>
						</Form.Group>

						<Form.Group className="mb-3 ">
							<Form.Label>Número de Animais</Form.Label>
							<InputGroup>
								<Form.Control type="number" placeholder="Informe aqui o número de Animais" size="lg" className="" value={animalsNumber} onChange={(e)=>{ setAnimalsNumber(Number(e.currentTarget.value)) }} />
								<Button variant="danger" onClick={()=>{ setAnimalsNumber(p=>  p-1) }}><Icon path={mdiMinus} size={1}/></Button>
								<Button variant="primary" onClick={()=>{ setAnimalsNumber(p=> p+1) }}><Icon path={mdiPlus} size={1}/></Button>
							</InputGroup>
						</Form.Group>

						<Form.Group className="mb-3 ">
							<Form.Label>Endereço Completo</Form.Label>
							<Form.Control type="text" placeholder="Informe aqui o Endereço" size="lg" className="" value={address} onChange={(e)=>{ setAddress(e.currentTarget.value) }} />
						</Form.Group>

						{error!="" && (
							<Alert variant="danger">{error}</Alert>
						)}

						<Button className="mb-4 w-100 text-uppercase py-3" size="lg" onClick={handleSolicitarResgate}>Solicitar</Button>
						
						<Button variant="light" className="mb-4 w-100 text-uppercase py-3" size="lg" onClick={handleVolta}>Voltar</Button>
					</Form>
				</Card.Body>
			</Card>
			
		</Layout>
	)
}