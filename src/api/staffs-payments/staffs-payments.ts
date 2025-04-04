import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddEditStaffsPayment, IGetStaffsPaymentsParams, IStaffsPayments } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class StaffsPayments extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getStaffsPayments = (params: IGetStaffsPaymentsParams): Promise<IResponse<IStaffsPayments[]>> =>
    this.get(Endpoints.StaffsPayments, { params });

  addStaffsPayment = (params: IAddEditStaffsPayment): Promise<AxiosResponse> =>
    this.post(Endpoints.StaffsPayments, params);

  updateStaffsPayment = (params: IAddEditStaffsPayment): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.StaffsPayments}/${params?.id}`, params);

  deleteStaffPayment = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.StaffsPayments}/${id}`);
}

export const staffsPaymentsApi = new StaffsPayments(config);
