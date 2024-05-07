import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Tab, Tabs } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

export default function Resgates() {
  const navigate = useNavigate();
  const { latitude, longitude, token } = useAuth();

  function fetchDataPending(page: any) {
    return fetch(
      `${
        import.meta.env.VITE_API_URL
      }/Rescue/ListPendingRescues?page=${page}&size=${
        import.meta.env.VITE_PAGE_SIZE
      }&latitude=${latitude}&longitude=${longitude}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  function fetchDataComleted(page: any) {
    return fetch(
      `${
        import.meta.env.VITE_API_URL
      }/Rescue/ListCompletedRescues?page=${page}&size=${
        import.meta.env.VITE_PAGE_SIZE
      }&latitude=${latitude}&longitude=${longitude}`
    );
  }

  const queryPending = useInfiniteQuery<any>({
    queryKey: ["ListPengingRescues"],
    queryFn: ({ pageParam = 0 }) => fetchDataPending(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.rescueId,
  });
  const queryCompleted = useInfiniteQuery<any>({
    queryKey: ["ListCompletedRescues"],
    queryFn: ({ pageParam = 0 }) => fetchDataComleted(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.rescueId,
  });

  queryPending.isSuccess && console.log(queryPending.data.pages[0]);

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
  );
}
