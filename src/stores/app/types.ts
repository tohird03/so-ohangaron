import {MenuProps} from 'antd/es/menu/menu';

export type TInitial = {
  version: string;
};

export type MenuItem = Required<MenuProps>['items'][number];
