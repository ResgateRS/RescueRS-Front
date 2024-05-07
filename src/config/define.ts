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
  totalPeopleNumber: number;
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
  totalPeopleNumber: number;
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
  totalPeopleNumber: number;
  childrenNumber: number;
  elderlyNumber: number;
  disabledNumber: number;
  animalsNumber: number;
  latitude: number;
  longitude: number;
};
