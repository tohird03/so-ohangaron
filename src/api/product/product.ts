import {AxiosResponse} from 'axios';
import {Endpoints, umsStages} from '../endpoints';
import {INetworkConfig, Instance} from '../instance';
import {IResponse} from '../types';
import { IAddEditProduct, IGetProductsParams, IProductTotalCalc, IProducts } from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ProductsApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getProducts = (params: IGetProductsParams): Promise<IResponse<IProducts[], IProductTotalCalc>> =>
    this.get(Endpoints.products, {params});

  addNewProduct = (params: IAddEditProduct): Promise<AxiosResponse> =>
    this.post(Endpoints.products, params);

  updateProduct = (params: IAddEditProduct): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.products}/${params?.id}`, params);

  deleteProduct = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.products}/${id}`);
}

export const productsApi = new ProductsApi(config);
