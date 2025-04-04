import { AxiosResponse } from 'axios';
import { Endpoints, umsStages } from '../endpoints';
import { INetworkConfig, Instance } from '../instance';
import { IResponse } from '../types';
import {
  IAddClientInfo,
  IAddSupplierInfo,
  IClientsInfo,
  IDeed,
  IGetClientDeedExcelParams,
  IGetClientDeedParams,
  IGetClientsInfoParams,
  IGetSupplierInfoParams,
  ISupplierDeed,
  ISupplierInfo,
  IUpdateUser,
} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
  stageUrl: umsStages.apiUrl,
};

class ClientsInfoApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getClientsInfo = (params: IGetClientsInfoParams): Promise<IResponse<IClientsInfo[]>> =>
    this.get(Endpoints.Clients, { params });

  getSingleClient = (clientId: string): Promise<IClientsInfo> =>
    this.get(`${Endpoints.Users}/${clientId}`);

  getClientDeed = (params: IGetClientDeedParams): Promise<IResponse<IDeed[]>> =>
    this.get(Endpoints.ClientsDeed, { params });

  addClients = (params: IAddClientInfo): Promise<AxiosResponse> =>
    this.post(Endpoints.Clients, params);

  getSupplierInfo = (params: IGetSupplierInfoParams): Promise<IResponse<ISupplierInfo[]>> =>
    this.get(Endpoints.Supplier, { params });

  addSupplier = (params: IAddSupplierInfo): Promise<AxiosResponse> =>
    this.post(Endpoints.Supplier, params);

  getSupplierDeed = (params: IGetClientDeedParams): Promise<IResponse<ISupplierDeed[]>> =>
    this.get(Endpoints.SupplierDeed, { params });

  // UPDATE
  updateUser = (params: IUpdateUser): Promise<AxiosResponse> =>
    this.patch(`${Endpoints.Users}/${params?.id}`, params);

  deleteUser = (id: string): Promise<AxiosResponse> =>
    this.delete(`${Endpoints.Users}/${id}`);

  getUploadDeedToExel = (params: IGetClientDeedExcelParams): Promise<any> =>
    this.get(`${Endpoints.ClientDeedExcelUpload}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  getUploadSupplierDeedToExel = (params: IGetClientDeedExcelParams): Promise<any> =>
    this.get(`${Endpoints.SupplierDeedExcelUpload}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });

  getUploadClients = (params: IGetClientsInfoParams): Promise<any> =>
    this.get(`${Endpoints.UploadClient}`, {
      params,
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/xlsx',
      },
    });
}

export const clientsInfoApi = new ClientsInfoApi(config);
