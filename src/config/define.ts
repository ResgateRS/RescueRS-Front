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

export type ListMyRescuesType = {
  rescueId: string;
  requestDateTime: string;
  adultsNumber: number;
  childrenNumber: number;
  elderlyNumber: number;
  disabledNumber: number;
  animalsNumber: number;
  rescued: boolean;
};

export type APIResponseListMyRescues = APIResponse<ListMyRescuesType[]>;

export type ListPendingRescuesType = {
  rescueId: string;
  requestDateTime: string;
  adultsNumber: number;
  childrenNumber: number;
  elderlyNumber: number;
  disabledNumber: number;
  animalsNumber: number;
  latitude: number;
  longitude: number;
  cellphone: string;
  rescued: boolean;
  distance: number;
};

export type APIResponseListPendingRescues = APIResponse<
  ListPendingRescuesType[]
>;

export type APIRequestRequest = {
  contactPhone: string;
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
