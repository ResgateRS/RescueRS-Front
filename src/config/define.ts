import { QueryClient } from "@tanstack/react-query";

export type APIResponse<T = unknown> = {
  Result: number;
  Message: string;
  token: string;
  rescuer: boolean;
  Data?: T;
};

export type LoginResponseType = {
  token: string;
  rescuer: boolean;
};

export type APIResponseLogin = APIResponse<LoginResponseType>;

export enum RescueStatus {
  Pending = 0,
  Started = 1,
  Completed = 2,
}

export type ListMyRescuesType = {
  rescueId: string;
  requestDateTime: string;
  adultsNumber: number;
  childrenNumber: number;
  elderlyNumber: number;
  disabledNumber: number;
  animalsNumber: number;
  description: string;
  updateDateTime: string;
  status: RescueStatus;
};

export type APIResponseListMyRescues = APIResponse<ListMyRescuesType[]>;

export type ListPendingRescuesType = {
  rescueId: string;
  requestDateTime: string;
  updateDateTime?: string;
  description?: string;
  adultsNumber: number;
  childrenNumber: number;
  elderlyNumber: number;
  disabledNumber: number;
  animalsNumber: number;
  latitude: number;
  longitude: number;
  cellphone: string;
  status: RescueStatus;
  distance: number;
  startedByMe?: boolean;
};

export type APIResponseListPendingRescues = APIResponse<
  ListPendingRescuesType[]
>;

export type APIRequestRequest = {
  contactPhone: string;
  description: string | null;
  adultsNumber: number;
  childrenNumber: number;
  elderlyNumber: number;
  disabledNumber: number;
  animalsNumber: number;
  latitude: number;
  longitude: number;
};

export type APIConfirmRequest = {
  rescueId: string;
};

export function formatarDistancia(distancia: number) {
  if (distancia >= 1000) {
    return (distancia / 1000).toFixed(2) + " km";
  } else {
    return distancia.toFixed(0) + " m";
  }
}

export type Position = {
  lat: number;
  lng: number;
};

export const queryClient = new QueryClient();
