import {ReactNode} from 'react';
import {IRolesCheck} from '@/api/app';

export interface IMenuItems {
  children?: IMenuItems[] | [];
  icon: ReactNode;
  key: string;
  label: string;
  parent?: IMenuItems['key'];
  roleKey?: IRolesCheck;
}
