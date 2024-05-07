import React from "react";
import { Alert, Button, Card, ListGroup } from "react-bootstrap";
import Layout from "../../components/Layout";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import RestageItem from "../../components/RestageItem";

type ListMyRescuesType = {
    "rescueId": string;
    "requestDateTime": string;
    "totalPeopleNumber": number;
    "childrenNumber": number;
    "elderlyNumber": number;
    "disabledNumber": number;
    "animalsNumber": number;
    "rescued": boolean;
}

type APIResponseListMyRescues = Omit<APIResponse,'Data'> & {Data: ListMyRescuesType[]};

export default function MinhasSolicitacoes(){

	const navigate = useNavigate();
	const {latitude, longitude, token} = useAuth();

	const query = useInfiniteQuery<APIResponseListMyRescues>({
		queryKey: ['ListMyRescues'],
		queryFn: ({ pageParam = 0 }) => fetchData(pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.Data.length>0 ? lastPage.Data[lastPage.Data.length-1].rescueId : null,
	})

	async function fetchData(page: any){
		let resp = await fetch(`${import.meta.env.VITE_API_URL}/Rescue/ListMyRescues?latitude=${latitude}&longitude=${longitude}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					page: page,
					size: import.meta.env.VITE_PAGE_SIZE
				},
			}
		);
		return await resp.json() as APIResponseListMyRescues;
	}

	function handleSolicitarResgate(){
		navigate("/solicitarResgate");
	}

	console.log(query.data);
	return (
		<Layout>
			<Header/>

			<h4 className="mb-4">Minhas Solicitações</h4>

			<Button className="mb-4 w-100 text-uppercase py-3" size="lg" onClick={handleSolicitarResgate}>Solicitar Resgate</Button>

			<Card>
				<Card.Body>
					<ListGroup className="w-100">
						{query.isFetched && query.data?.pages[0].Data?.length===0 && (
							<>Nenhum registro encontrado</>
						)}
						{query.data?.pages.map((page, key)=>{
							return (
								<React.Fragment key={key}>
									{page.Data.map((item, itemKey)=>{
										return (
											<RestageItem
												key={itemKey}
												animalsNumber={item.animalsNumber}
												childrenNumber={item.childrenNumber}
												elderlyNumber={item.elderlyNumber}
												totalPeopleNumber={item.totalPeopleNumber}
											/>
										)
									})}
								</React.Fragment>
							)
						})}
					</ListGroup>
				</Card.Body>
			</Card>
			
		</Layout>
	)
}