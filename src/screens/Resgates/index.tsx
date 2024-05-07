// import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Alert, Form, ListGroup, Tab, Tabs } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import React, { useState } from "react";
import RestageItem from "../../components/RestageItem";
import { APIResponseListPengingRescues } from "../../config/define";
import Header from "../../components/Header";
import InfiniteScroll from "../../components/InfiniteScroll";
import { useApi } from "../../hooks/api";

export default function Resgates() {
  // const navigate = useNavigate();
  const { latitude, longitude, token } = useAuth();
  const [proximity, setProximity] = useState(false);
  const { get } = useApi();

  async function fetchDataPending(page?: any) {
    let url = `${import.meta.env.VITE_API_URL}/Rescue/ListPendingRescues`;
    if(proximity){
      url = `${import.meta.env.VITE_API_URL}/Rescue/ListPendingRescuesByProximity`;
    }
    return await get<APIResponseListPengingRescues>(
      url,
      {
        search:
          proximity && typeof latitude === "number" && typeof longitude === "number"
            ? new URLSearchParams({
                latitude: latitude.toString(),
                longitude: longitude.toString(),
              })
            : undefined,
        headers: page ? {
              "X-Cursor": page.toString(),
              "X-PageSize": import.meta.env.VITE_PAGE_SIZE,
            } : {
              "X-PageSize": import.meta.env.VITE_PAGE_SIZE,
            },
      }
    );
  }

  async function fetchDataPendingNextPage() {
    queryPending.fetchNextPage();
  }

  async function fetchDataCompleted(page?: any) {
    return await get<APIResponseListPengingRescues>(
      `${
        import.meta.env.VITE_API_URL
      }/Rescue/ListCompletedRescues?latitude=${latitude}&longitude=${longitude}`,
      {
        headers:
          page ? {
                "X-Cursor": page.toString(),
                "X-PageSize": import.meta.env.VITE_PAGE_SIZE,
            } : {
                "X-PageSize": import.meta.env.VITE_PAGE_SIZE,
            },
      }
    );
  }

  async function fetchDataCompletedNextPage() {
    queryCompleted.fetchNextPage();
  }

  const queryPending = useInfiniteQuery<APIResponseListPengingRescues>({
    queryKey: ["ListPengingRescues", token, proximity],
    queryFn: ({ pageParam }) => fetchDataPending(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.Data.length > 0
        ? lastPage.Data[lastPage.Data.length - 1].rescueId
        : null,
  });
  const queryCompleted = useInfiniteQuery<APIResponseListPengingRescues>({
    queryKey: ["ListCompletedRescues", token],
    queryFn: ({ pageParam }) => fetchDataCompleted(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.Data.length > 0
        ? lastPage.Data[lastPage.Data.length - 1].rescueId
        : null,
  });

  queryPending.isSuccess && console.log(queryPending.data.pages[0]);

  return (
    <Layout>
      <Header/>
			<h4 className="d-flex align-items-center justify-content-between mb-4">
        Resgates
        <div className="d-flex align-items-center">
          <span className="fs-6 fw-normal me-2">Ordem:</span>
          <Form.Select onChange={(e)=>{ setProximity(e.currentTarget.value==="true"); }} style={{width: "auto"}}>
            <option value={"false"}>Tempo</option>
            <option value={"true"}>Proximidade</option>
          </Form.Select>
        </div>
      </h4>

      <Tabs defaultActiveKey="pending" className="w-100" fill>
        <Tab eventKey="pending" title="Pendentes">
          {queryPending.isFetched &&
            queryPending.data?.pages[0].Data?.length === 0 && (
              <Alert variant="light">Nenhum registro encontrado</Alert>
            )}
          <ListGroup className="w-100">
            {queryPending.data?.pages.map((page, key) => {
              return (
                <React.Fragment key={key}>
                  {page.Data.map((item, itemKey) => {
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

          <InfiniteScroll
            more={queryPending.hasNextPage}
            load={fetchDataPendingNextPage}
            loading={queryPending.isFetching || queryPending.isFetchingNextPage}
          />
        </Tab>
        <Tab eventKey="completed" title="Concluídos">
          {queryCompleted.isFetched &&
            queryCompleted.data?.pages[0].Data?.length === 0 && (
              <Alert variant="light">Nenhum registro encontrado</Alert>
            )}
          <ListGroup className="w-100">
            {queryCompleted.data?.pages.map((page, key) => {
              return (
                <React.Fragment key={key}>
                  {page.Data.map((item, itemKey) => {
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

          <InfiniteScroll
            more={queryCompleted.hasNextPage}
            load={fetchDataCompletedNextPage}
            loading={
              queryCompleted.isFetching || queryCompleted.isFetchingNextPage
            }
          />
        </Tab>
      </Tabs>
    </Layout>
  );
}
