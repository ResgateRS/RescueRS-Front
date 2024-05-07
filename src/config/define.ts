export type APIResponse = {
  Result: number;
  Message: string;
  token: string;
  rescuer: boolean;
  Data?: any;
};

export type ListMyRescuesType = {
  "rescueId": string;
  "requestDateTime": string;
  "totalPeopleNumber": number;
  "childrenNumber": number;
  "elderlyNumber": number;
  "disabledNumber": number;
  "animalsNumber": number;
  "rescued": boolean;
}

export type APIResponseListMyRescues = Omit<APIResponse,'Data'> & {Data: ListMyRescuesType[]};

export type ListPengingRescuesType = {
  "rescueId": string;
  "requestDateTime": string;
  "totalPeopleNumber": number;
  "childrenNumber": number;
  "elderlyNumber": number;
  "disabledNumber": number;
  "animalsNumber": number;
  "rescued": boolean;
}

export type APIResponseListPengingRescues = Omit<APIResponse,'Data'> & {Data: ListPengingRescuesType[]};