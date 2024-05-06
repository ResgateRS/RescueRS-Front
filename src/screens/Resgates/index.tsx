import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Tab, Tabs } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

export default function Resgates(){

	const navigate = useNavigate();
	const {latitude, longitude} = useAuth();

	const queryPending = useInfiniteQuery<any>({
		queryKey: ['ListPengingRescues'],
		queryFn: ({ pageParam = 0 }) => fetchDataPending(pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.rescueId,
	});
	const queryCompleted = useInfiniteQuery<any>({
		queryKey: ['ListComletedRescues'],
		queryFn: ({ pageParam = 0 }) => fetchDataComleted(pageParam),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.rescueId,
	})

	function fetchDataPending(page: any){
		return fetch(`${import.meta.env.API_URL}/Rescue/ListPengingRescues?page=${page}&size=${import.meta.env.PAGE_SIZE}&latitude=${latitude}&longitude=${longitude}`)
	}

	function fetchDataComleted(page: any){
		return fetch(`${import.meta.env.API_URL}/Rescue/ListComletedRescues?page=${page}&size=${import.meta.env.PAGE_SIZE}&latitude=${latitude}&longitude=${longitude}`)
	}

	return (
		<Layout>
			<div className="d-flex my-4">
				<h1>Resgates</h1>
			</div>

			<Tabs defaultActiveKey="pending" className="mb-3 w-100" fill>
				<Tab eventKey="pending" title="Pendentes">
					Tab content for Home
				</Tab>
				<Tab eventKey="completed" title="Concluídos">
					Tab content for Profile
				</Tab>
			</Tabs>
		</Layout>
	)
}