import { IClientsInfo, ISeller } from "../clients";
import { IProducts } from "../product/types";
import { IPagination, IPayment, IPaymentType } from "../types";

export interface IOrder {
  id: string;
  client: IClientsInfo;
  seller: ISeller;
  payment: IPayment;
  products: IOrderProducts[];
  sum: number;
  debt: number;
  accepted: boolean;
  sellingDate: string;
  articl: number;
}

export interface IGetOrdersParams extends IPagination {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  clientId?: string;
  accepted?: string;
  sellerId?: string;
  type?: 'excel'
}


export interface IOrderProducts {
  id: string,
  cost: number;
  count: number,
  price: number;
  avarage_cost: number;
  product: IProducts;
}

export interface IAddOrderProducts {
  product_id: string;
  count: number;
  price: number;
}

export interface IAddOrderModalForm extends IAddOrderProducts {
  clientId: string;
  sellingDate: string;
}

export interface IAddOrder {
  clientId: string;
  sellingDate?: string;
  accepted?: boolean;
  products: IAddOrderProducts[];
}

export interface IUpdateOrder {
  id: string;
  clientId?: string;
  sellingDate?: Date | string;
  accepted?: boolean;
  sendUser: boolean;
}

export interface IUploadOrderToExelParams extends IGetOrdersParams {
  orderId: string;
}

export interface IOrderProductAdd extends IAddOrderProducts {
  order_id: string;
}

export interface IUpdateOrderProduct {
  id: string;
  count: number;
  price: number;
}

export interface IOrderStatistic {
  todaySales: number,
  weeklySales: number,
  monthlySales: number,
  ourDebt: DebtResponse,
  fromDebt: DebtResponse,
  weeklyChart: IOrderStatisticChart[],
}

export declare interface DebtResponse {
  client: number,
  supplier: number
}

export interface IOrderStatisticChart {
  date: string;
  sum: number;
}

export interface ITotalOrderPaymentCalc {
  totalCard: number | null
  totalCash: number |null
  totalDebt: number | null
  totalOther: number | null
  totalPay: number | null
  totalSum: number | null
  totalTransfer: number | null
}
