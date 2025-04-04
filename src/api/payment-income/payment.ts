import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IIncomeAddEditPaymentParams, IIncomeGetClientsPaymentsParams, ISupplierPayments } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class IncomePaymentApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getIncomePayments = (params: IIncomeGetClientsPaymentsParams): Promise<IResponse<ISupplierPayments[]>> =>
    this.get(Endpoints.incomePayment, { params });

  addIncomePayment = (params: IIncomeAddEditPaymentParams): Promise<AxiosResponse> =>
    this.post(Endpoints.incomePayment, params);

  updateIncomePayment = (params: IIncomeAddEditPaymentParams): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.incomePayment}/${params?.id}`, params);

  deleteIncomePayment = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.incomePayment}/${id}`);
}

export const incomePaymentApi = new IncomePaymentApi(config);
