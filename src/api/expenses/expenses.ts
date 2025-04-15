import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import { IAddEditExpenses, IExpenses, IGetExpensesParams } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class Expenses extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getExpenses = (params: IGetExpensesParams): Promise<IResponse<IExpenses[]>> =>
    this.get(Endpoints.Expenses, { params });

  addExpenses = (params: IAddEditExpenses): Promise<AxiosResponse> =>
    this.post(Endpoints.Expenses, params);

  updateExpenses = (params: IAddEditExpenses): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.Expenses}/${params?.id}`, params);

  deleteExpenses = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.Expenses}/${id}`);
}

export const expensesApi = new Expenses(config);
