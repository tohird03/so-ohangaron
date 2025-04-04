import { IOrder } from '../order/types';
import { IReturnedOrder } from '../returned-order/types';
import {IPagination, IPayment} from '../types';

export interface IUpdateUser {
  id: string;
  name: string;
  phone: string;
}

// THIS SELLER USER
export interface ISeller {
  id: string;
  name: string;
  phone: string;
}

// CLIENT
export interface IClientsInfo {
  id: string;
  name: string;
  phone: string;
  debt: number;
  lastSale: string;
}

export interface IGetClientsInfoParams extends IPagination {
  search?: string;
  debt?: number;
  debtType?: IClientDebtFilter;
}

export enum IClientDebtFilter {
  EQUAL = 'equal',
  GREATER = 'greater',
  LESS = 'less',
}

export interface IAddClientInfo {
  id?: string;
  name: string;
  phone: string;
}

// SUPPLIER
export interface IGetSupplierInfoParams extends IPagination {
  search?: string;
  debt?: number;
  debtType?: IClientDebtFilter;
}

export interface ISupplierInfo {
  id: string;
  name: string;
  phone: string;
  lastSale: string;
  debt: number;
}

export interface IAddSupplierInfo {
  id?: string;
  name: string;
  phone: string;
}

export interface IDeedPayment extends IPayment {
  type: 'payment';
  description: string;
}

export interface IDeedOrder extends IOrder {
  type: 'order';
  description: string;
  createdAt?: string;
}

export interface IDeedReturnedOrder extends IReturnedOrder {
  type: 'returned-order';
  description: string;
}

export type IDeed = IDeedPayment | IDeedOrder | IDeedReturnedOrder;
export type ISupplierDeed = IDeedPayment | IDeedOrder;

export interface IGetClientDeedParams {
  id: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IGeSupplierDeedParams {
  id: string;
  startDate?: string;
  endDate?: string;
}

export interface IGetClientDeedExcelParams {
  id: string;
  startDate?: Date;
  endDate?: Date;
  type: 'deed' | 'product';
}
