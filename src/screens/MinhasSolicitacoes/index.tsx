import { Button, ListGroup } from "react-bootstrap";
import Layout from "../../components/Layout";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function MinhasSolicitacoes(){

	const query = useInfiniteQuery<any>({
		queryKey: ['minhasSolicitacoes'],
		queryFn: ({ pageParam = 0 }) => fetchData(pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.rescueId,
	})

	function fetchData(page: any){
		return fetch(`${import.meta.env.API_URL}/ListMyRescues?page=${page}&size=${import.meta.env.PAGE_SIZE}`)
	}

	function handleSolicitarResgate(){

	}

	return (
		<Layout>
			<div className="d-flex my-5">
				<h1>Minhas Solicitações</h1>
			</div>

			<Button className="mb-4 w-100 text-uppercase py-3" size="lg" onClick={handleSolicitarResgate}>Solicitar Resgate</Button>

			<ListGroup className="w-100">
				{query.data?.pages.map((page, key)=>{
					return (
						<>
							{page.data?.map(()=>{
								return (
									<ListGroup.Item key={key} action className="w-100">
										Link 1
									</ListGroup.Item>
								)
							})}
						</>
					)
				})}
				
			</ListGroup>
		</Layout>
	)
}