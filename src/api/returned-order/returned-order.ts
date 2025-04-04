import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import {
  IAddProductsToReturnedOrder,
  IAddReturnedOrders,
  IGetReturnedOrdersParams,
  IReturnedOrder,
  IUpdateProductFromReturnedOrders,
  IUpdateReturnedOrder,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ReturnedOrderApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getReturnedOrders = (params: IGetReturnedOrdersParams): Promise<IResponse<IReturnedOrder[]>> =>
    this.get(Endpoints.returnedOrder, { params });

  addReturnedOrder = (params: IAddReturnedOrders): Promise<IReturnedOrder> =>
    this.resPost(Endpoints.returnedOrder, params);

  getSingleReturnedOrder = (orderId: string): Promise<IReturnedOrder> =>
    this.get(`${Endpoints.returnedOrder}/${orderId}`);

  updateReturnedOrder = (params: IUpdateReturnedOrder): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.returnedOrder}/${params?.id}`, params);

  deleteReturnedOrder = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.returnedOrder}/${id}`);

  addProductToReturnedOrder = (params: IAddProductsToReturnedOrder): Promise<AxiosResponse> =>
    this.post(Endpoints.returnedProduct, params);

  deleteProductFromReturnedOrder = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.returnedProduct}/${id}`);

  updateProductFromReturnedOrder = (params: IUpdateProductFromReturnedOrders): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.returnedProduct}/${params?.id}`, params);

  getAllUploadReturnedOrderToExel = (params: IGetReturnedOrdersParams): Promise<any> =>
    this.get(`${Endpoints.productsReturnedOrderExel}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  getUploadReturnedOrderToExel = (orderId: string): Promise<any> =>
    this.get(`${Endpoints.productsReturnedOrderExel}/${orderId}`, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });
}

export const returnedOrderApi = new ReturnedOrderApi(config);
