import {AxiosResponse} from 'axios';
import {Endpoints} from '@/api/endpoints';
import {INetworkConfig, Instance} from '@/api/instance';
import {IResponse} from '@/api/types';
import {IMyProfile} from './types';

const config: INetworkConfig = {
  baseURL: Endpoints.Base,
};

class AppApi extends Instance {
  constructor(config: INetworkConfig) {
    super(config);
  }

  getProfile = (): Promise<IResponse<IMyProfile>> =>
    this.get(`${Endpoints.UserProfile}`);

  logout = (link: string): Promise<AxiosResponse<any>> =>
    this.post(link);
}

export const appApi = new AppApi(config);
