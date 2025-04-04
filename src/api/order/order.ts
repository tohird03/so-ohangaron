import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import {
  IAddOrder,
  IGetOrdersParams,
  IOrder,
  IOrderProductAdd,
  IOrderStatistic,
  ITotalOrderPaymentCalc,
  IUpdateOrder,
  IUpdateOrderProduct,
  IUploadOrderToExelParams,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};


class OrdersApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getOrders = (params: IGetOrdersParams): Promise<IResponse<IOrder[], ITotalOrderPaymentCalc>> =>
    this.get(Endpoints.productsOrder, { params });

  getSingleOrder = (orderId: string): Promise<IOrder> =>
    this.get(`${Endpoints.productsOrder}/${orderId}`);

  addNewOrder = (params: IAddOrder): Promise<IOrder> =>
    this.resPost(Endpoints.productsOrder, params);

  updateOrder = (params: IUpdateOrder): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.productsOrder}/${params?.id}`, params);

  deleteOrder = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.productsOrder}/${id}`);

  orderProductAdd = (params: IOrderProductAdd): Promise<AxiosResponse> =>
    this.post(Endpoints.productsOrderProduct, params);

  updateOrderProduct = (params: IUpdateOrderProduct): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.productsOrderProduct}/${params?.id}`, params);

  deleteOrderProduct = (productId: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.productsOrderProduct}/${productId}`);

  getAllUploadOrderToExel = (params: IGetOrdersParams): Promise<any> =>
    this.get(`${Endpoints.productsOrderExel}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  getUploadOrderToExel = (params: IUploadOrderToExelParams): Promise<any> =>
    this.get(`${Endpoints.productsOrderExel}/${params?.orderId}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  getOrdersStatistic = (): Promise<IOrderStatistic> =>
    this.get(Endpoints.productsOrderStatistic);
}

export const ordersApi = new OrdersApi(config);
