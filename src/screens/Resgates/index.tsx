import Layout from "../../components/Layout";
import {
  InfiniteData,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Alert, Form, ListGroup, Tab, Tabs } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import React, { useCallback, useState } from "react";
import RestageItem from "../../components/RestageItem";
import { APIResponseListPendingRescues } from "../../config/define";
import InfiniteScroll from "../../components/InfiniteScroll";
import { useApi } from "../../hooks/api";

type QueryTabProps = {
  query: UseInfiniteQueryResult<
    InfiniteData<APIResponseListPendingRescues, unknown>,
    Error
  >;
  refreshData: () => void;
};
const QueryResults: React.FC<QueryTabProps> = ({
  query,
  refreshData,
}: QueryTabProps) => {
  console.log({ query });
  return (
    <>
      {query.isFetched &&
        (!query.data?.pages[0].Data ||
          query.data?.pages[0].Data?.length === 0) && (
          <Alert variant="light" className="mt-4 text-center">
            Nenhum registro encontrado
          </Alert>
        )}
      <ListGroup className="w-100 border border-top-0 p-2 gap-4 rounded-top-0">
        {query.data?.pages.map((page, key) => {
          return (
            <React.Fragment key={key}>
              {page.Data?.map((item) => {
                return (
                  <RestageItem
                    key={item.rescueId}
                    rescueId={item.rescueId}
                    requestDateTime={item.requestDateTime}
                    animalsNumber={item.animalsNumber}
                    childrenNumber={item.childrenNumber}
                    elderlyNumber={item.elderlyNumber}
                    adultsNumber={item.adultsNumber}
                    disabledNumber={item.disabledNumber}
                    cellphone={item.cellphone}
                    latitude={item.latitude}
                    longitude={item.longitude}
                    distance={item.distance}
                    status={item.status}
                    startedByMe={item.startedByMe}
                    isRescuer
                    refreshData={refreshData}
                  />
                );
              })}
            </React.Fragment>
          );
        })}
      </ListGroup>

      <InfiniteScroll
        more={query.hasNextPage}
        load={async () => {
          await query.fetchNextPage();
        }}
        loading={query.isFetching || query.isFetchingNextPage}
      />
    </>
  );
};

export default function Resgates() {
  const { position, token } = useAuth();
  const [proximity, setProximity] = useState(position ? true : false);
  const { get } = useApi();

  async function fetchDataPending(page?: string) {
    let url = `${import.meta.env.VITE_API_URL}/Rescue/ListPendingRescues`;
    if (proximity) {
      url = `${
        import.meta.env.VITE_API_URL
      }/Rescue/ListPendingRescuesByProximity`;
    }
    return await get<APIResponseListPendingRescues>(url, {
      search: position
        ? new URLSearchParams({
            latitude: position.lat.toString(),
            longitude: position.lng.toString(),
          })
        : undefined,
      headers: page
        ? {
            "X-Cursor": page.toString(),
            "X-PageSize": import.meta.env.VITE_PAGE_SIZE,
          }
        : {
            "X-PageSize": import.meta.env.VITE_PAGE_SIZE,
          },
    });
  }

  async function fetchDataMy(page?: string) {
    return await get<APIResponseListPendingRescues>(
      `${import.meta.env.VITE_API_URL}/Rescue/ListMyRescues`,
      {
        search: position
          ? new URLSearchParams({
              latitude: position.lat.toString(),
              longitude: position.lng.toString(),
            })
          : undefined,
        headers: page
          ? {
              "X-Cursor": page.toString(),
              "X-PageSize": import.meta.env.VITE_PAGE_SIZE,
            }
          : {
              "X-PageSize": import.meta.env.VITE_PAGE_SIZE,
            },
      },
    );
  }

  async function fetchDataStarted(page?: string) {
    return await get<APIResponseListPendingRescues>(
      `${import.meta.env.VITE_API_URL}/Rescue/ListInProgressRescues`,
      {
        search: position
          ? new URLSearchParams({
              latitude: position.lat.toString(),
              longitude: position.lng.toString(),
            })
          : undefined,
        headers: page
          ? {
              "X-Cursor": page.toString(),
              "X-PageSize": import.meta.env.VITE_PAGE_SIZE,
            }
          : {
              "X-PageSize": import.meta.env.VITE_PAGE_SIZE,
            },
      },
    );
  }

  const queryPending = useInfiniteQuery<APIResponseListPendingRescues>({
    queryKey: ["ListPengingRescues", token, proximity],
    queryFn: ({ pageParam }) => fetchDataPending(pageParam as string),
    initialPageParam: undefined,
    refetchInterval: 1000 * 60,
    getNextPageParam: (lastPage) =>
      lastPage.Data && lastPage.Data.length > 0
        ? lastPage.Data[lastPage.Data.length - 1].rescueId
        : null,
  });
  const queryMy = useInfiniteQuery<APIResponseListPendingRescues>({
    queryKey: ["ListMyRescues", token, proximity],
    queryFn: ({ pageParam }) => fetchDataMy(pageParam as string),
    initialPageParam: undefined,
    refetchInterval: 1000 * 60,
    getNextPageParam: (lastPage) =>
      lastPage.Data && lastPage.Data.length > 0
        ? lastPage.Data[lastPage.Data.length - 1].rescueId
        : null,
  });
  const queryStarted = useInfiniteQuery<APIResponseListPendingRescues>({
    queryKey: ["ListStartedRescues", token],
    queryFn: ({ pageParam }) => fetchDataStarted(pageParam as string),
    initialPageParam: undefined,
    refetchInterval: 1000 * 60,
    getNextPageParam: (lastPage) =>
      lastPage.Data && lastPage.Data?.length > 0
        ? lastPage.Data[lastPage.Data.length - 1].rescueId
        : null,
  });

  const refreshData = useCallback(() => {
    queryPending.refetch();
    queryMy.refetch();
    queryStarted.refetch();
  }, [queryPending, queryMy, queryStarted]);

  return (
    <Layout>
      <h5 className="d-flex align-items-center justify-content-between mb-4">
        Resgates
        <div className="d-flex align-items-center">
          <span className="fs-6 fw-normal me-2">Ordem:</span>
          <Form.Select
            onChange={(e) => {
              setProximity(e.currentTarget.value === "true");
            }}
            style={{ width: "auto" }}
            disabled={!position}
            value={proximity && position ? "true" : "false"}
          >
            <option value={"false"}>Tempo</option>
            <option value={"true"}>Proximidade</option>
          </Form.Select>
        </div>
      </h5>

      <Tabs defaultActiveKey="pending" justify fill>
        <Tab eventKey="pending" title="Pendentes">
          <QueryResults query={queryPending} refreshData={refreshData} />
        </Tab>
        <Tab eventKey="started" title="Iniciados">
          <QueryResults query={queryStarted} refreshData={refreshData} />
        </Tab>
        <Tab eventKey="my" title="Meus">
          <QueryResults query={queryMy} refreshData={refreshData} />
        </Tab>
      </Tabs>
    </Layout>
  );
}
