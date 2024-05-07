import React from "react";
import { Alert, Button, ListGroup } from "react-bootstrap";
import Layout from "../../components/Layout";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/Header";
import RestageItem from "../../components/RestageItem";
import { APIResponseListMyRescues } from "../../config/define";
import { useApi } from "../../hooks/api";

export default function MinhasSolicitacoes() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { get } = useApi();

  const query = useInfiniteQuery<APIResponseListMyRescues>({
    queryKey: ["ListMyRescues"],
    queryFn: ({ pageParam }) => fetchData(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => (lastPage.Data && lastPage.Data.length > 0 ? lastPage.Data[lastPage.Data.length - 1].rescueId : null),
  });

  async function fetchData(page: any) {
    return await get<APIResponseListMyRescues>(`${import.meta.env.VITE_API_URL}/Rescue/ListMyRescues`, {
      headers: page
        ? {
            Authorization: `Bearer ${token}`,
            "X-Cursor": page,
            "X-PageSize": import.meta.env.VITE_PAGE_SIZE,
          }
        : {
            Authorization: `Bearer ${token}`,
            "X-PageSize": import.meta.env.VITE_PAGE_SIZE,
          },
    });
  }

  function handleSolicitarResgate() {
    navigate("/solicitarResgate");
  }

  return (
    <Layout>
      <Header />

      <h4 className="mb-4">Minhas Solicitações</h4>

      <Button className="mb-4 w-100 text-uppercase py-3" size="lg" onClick={handleSolicitarResgate}>
        Solicitar Resgate
      </Button>

      {query.isFetched && query.data?.pages[0].Data?.length === 0 && <Alert variant="light">Nenhum registro encontrado</Alert>}

      <ListGroup className="w-100">
        {query.data?.pages.map((page, key) => {
          return (
            <React.Fragment key={key}>
              {page.Data?.map((item, itemKey) => {
                return (
                  <RestageItem
                    key={itemKey}
                    animalsNumber={item.animalsNumber}
                    childrenNumber={item.childrenNumber}
                    elderlyNumber={item.elderlyNumber}
                    totalPeopleNumber={item.totalPeopleNumber}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </ListGroup>
    </Layout>
  );
}
