import {IPagination} from '../types';

export interface IStaffs {
  id: string;
  name: string;
  phone: string;
  permissions: IStaffPer[];
}

export interface IGetStaffsParams extends IPagination {
  search?: string;
}

export interface IAddStaff {
  id?: string;
  name: string;
  phone: string;
  password: string;
  permissions: string[];
}

export interface IUpdateStaff {
  id?: string;
  name: string;
  phone: string;
  password: string;
  connectPermissions: string[];
  disconnectPermissions: string[];
}

export interface IStaffPer {
  id: string;
  name: string;
}
