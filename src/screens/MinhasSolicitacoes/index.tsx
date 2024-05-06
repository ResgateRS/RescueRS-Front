import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import Layout from "../../components/Layout";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type ListMyRescuesType = {
    "rescueId": string;
    "requestDateTime": string;
    "totalPeopleNumber": string;
    "childrenNumber": string;
    "elderlyNumber": string;
    "disabledNumber": string;
    "animalsNumber": string;
    "rescued": boolean;
}

export default function MinhasSolicitacoes(){

	const navigate = useNavigate();
	const {latitude, longitude} = useAuth();

	const query = useInfiniteQuery<any>({
		queryKey: ['ListMyRescues'],
		queryFn: ({ pageParam = 0 }) => fetchData(pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.rescueId,
	})

	function fetchData(page: any){
		return fetch(`${import.meta.env.API_URL}/Rescue/ListMyRescues?page=${page}&size=${import.meta.env.PAGE_SIZE}&latitude=${latitude}&longitude=${longitude}`)
	}

	function handleSolicitarResgate(){
		navigate("/solicitarResgate");
	}

	return (
		<Layout>
			<div className="d-flex my-4">
				<h1>Minhas Solicitações</h1>
			</div>

			<Button className="mb-4 w-100 text-uppercase py-3" size="lg" onClick={handleSolicitarResgate}>Solicitar Resgate</Button>

			<ListGroup className="w-100">
				{query.data?.pages.map((page, key)=>{
					return (
						<React.Fragment key={key}>
							{page.data?.map((item: any, itemKey: any)=>{
								return (
									<ListGroup.Item key={itemKey} action className="w-100">
										Link 1
									</ListGroup.Item>
								)
							})}
						</React.Fragment>
					)
				})}
				
			</ListGroup>
		</Layout>
	)
}