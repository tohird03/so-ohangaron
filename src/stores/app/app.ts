import {makeAutoObservable} from 'mobx';
import {MenuProps} from 'antd/es/menu/menu';
import {appApi} from '@/api';
import {IMyProfile} from '@/api/app';
import {IMenuItems} from '@/constants';
import {addNotification} from '@/utils';
import {TInitial} from './types';

export class AppStore {
  initialParams: Partial<TInitial> | null = null;
  mainMenuItems: MenuProps['items'] | null = null;
  breadcrumbList: IMenuItems[] | null = null;
  staffInfo: IMyProfile | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  getProfile = () =>
    appApi.getProfile()
      .then(res =>
        // if (res.success) {
        //   this.staffInfo = res.data;
        // }
        res)
      .catch(err => {
        addNotification(err);
      });


  setInitialParams = (params: Partial<TInitial>) => {
    this.initialParams = params;
  };

  reset = () => {
    this.initialParams = null;
    this.breadcrumbList = null;
  };

}

export const appStore = new AppStore();
