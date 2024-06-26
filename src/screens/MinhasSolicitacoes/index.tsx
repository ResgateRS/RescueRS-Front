import React, { useEffect } from "react";
import { Alert, Button, ListGroup, Spinner } from "react-bootstrap";
import Layout from "../../components/Layout";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RestageItem from "../../components/RestageItem";
import { APIResponseListMyRescues } from "../../config/define";
import { useApi } from "../../hooks/api";
import InfiniteScroll from "../../components/InfiniteScroll";

export default function MinhasSolicitacoes() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { get } = useApi();

  const {
    isFetched,
    isFetching,
    isFetchedAfterMount,
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<APIResponseListMyRescues>({
    queryKey: ["ListMyRescues"],
    queryFn: ({ pageParam }) => fetchData(pageParam as string),
    initialPageParam: undefined,
    refetchInterval: 1000 * 60,
    getNextPageParam: (lastPage) =>
      lastPage.Data && lastPage.Data.length > 0
        ? lastPage.Data[lastPage.Data.length - 1].rescueId
        : null,
  });

  useEffect(() => {
    if (
      !isFetching &&
      isFetchedAfterMount &&
      data?.pages[0].Data?.length === 0
    ) {
      navigate("/solicitarResgate");
    }
  }, [isFetching, isFetchedAfterMount, data, navigate]);

  async function fetchData(page?: string) {
    return await get<APIResponseListMyRescues>(
      `${import.meta.env.VITE_API_URL}/Rescue/ListMyRescues`,
      {
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
      },
    );
  }

  function handleSolicitarResgate() {
    navigate("/solicitarResgate");
  }

  return (
    <Layout>
      <h5 className="mb-4">
        Minhas Solicitações
        {isFetching && <Spinner size="sm" className="ms-2" />}
      </h5>

      <Button
        className="mb-4 w-100 text-uppercase py-3 fw-medium"
        size="lg"
        onClick={handleSolicitarResgate}
      >
        Solicitar Resgate
      </Button>

      {isFetched && data?.pages[0].Data?.length === 0 && (
        <Alert variant="light">Nenhum registro encontrado</Alert>
      )}

      <ListGroup className="w-100 gap-4">
        {data?.pages.map((page, key) => {
          return (
            <React.Fragment key={key}>
              {page.Data?.map((item, itemKey) => {
                return (
                  <RestageItem
                    key={itemKey}
                    rescueId={item.rescueId}
                    requestDateTime={item.requestDateTime}
                    animalsNumber={item.animalsNumber}
                    childrenNumber={item.childrenNumber}
                    elderlyNumber={item.elderlyNumber}
                    adultsNumber={item.adultsNumber}
                    disabledNumber={item.disabledNumber}
                    description={item.description}
                    updateDateTime={item.updateDateTime}
                    status={item.status}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </ListGroup>

      <div className="d-flex justify-content-center">
        <InfiniteScroll
          more={hasNextPage}
          load={async () => {
            await fetchNextPage();
          }}
          loading={isFetching || isFetchingNextPage}
        />
      </div>
    </Layout>
  );
}
