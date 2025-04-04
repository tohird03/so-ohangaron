import { IClientsInfo, ISeller } from "../clients"
import { IOrder } from "../order/types"
import { IPagination, IPaymentType } from "../types"

export interface IClientsPayments extends IPaymentType {
  id: string,
  createdAt: string,
  order: IOrder,
  client: IClientsInfo,
  seller: ISeller,
}

export interface IGetClientsPaymentsParams extends IPagination {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  clientId?: string;
  sellerId?: string;
}

export interface IAddEditPaymentParams {
  id?: string,
  orderId?: string,
  clientId: string,
  cash: number,
  card: number,
  transfer: number,
  other: number,
  sendUser?: boolean,
}

export interface ITotalPayment {
  totalPay: number,
  totalCard: number,
  totalCash: number,
  totalTransfer: number,
  totalOther: number,
}
