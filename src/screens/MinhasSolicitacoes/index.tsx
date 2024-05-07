import React from "react";
import { Alert, Button, Card, ListGroup } from "react-bootstrap";
import Layout from "../../components/Layout";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import RestageItem from "../../components/RestageItem";
import { APIResponseListMyRescues } from "../../config/define";

export default function MinhasSolicitacoes(){

	const navigate = useNavigate();
	const {latitude, longitude, token} = useAuth();

	const query = useInfiniteQuery<APIResponseListMyRescues>({
		queryKey: ['ListMyRescues'],
		queryFn: ({ pageParam }) => fetchData(pageParam),
		initialPageParam: undefined,
		getNextPageParam: (lastPage) => lastPage.Data.length>0 ? lastPage.Data[lastPage.Data.length-1].rescueId : null,
	})

	async function fetchData(page: any){
		let resp = await fetch(`${import.meta.env.VITE_API_URL}/Rescue/ListMyRescues?latitude=${latitude}&longitude=${longitude}`,
			{
				headers: page ? {
					Authorization: `Bearer ${token}`,
					"X-Cursor": page,
					"X-PageSize": import.meta.env.VITE_PAGE_SIZE
				}:{
					Authorization: `Bearer ${token}`,
					"X-PageSize": import.meta.env.VITE_PAGE_SIZE
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
			
			{query.isFetched && query.data?.pages[0].Data?.length===0 && (
				<Alert variant="light">Nenhum registro encontrado</Alert>
			)}

			<ListGroup className="w-100">
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
			
		</Layout>
	)
}