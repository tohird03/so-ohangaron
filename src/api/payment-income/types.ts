import { IClientsInfo, ISupplierInfo } from "../clients"
import { IOrder } from "../order/types"
import { IPagination, IPaymentType } from "../types"

export interface ISupplierPayments extends IPaymentType {
  id: string,
  createdAt: string,
  order: IOrder,
  supplier: ISupplierInfo,
}

export interface IIncomeGetClientsPaymentsParams extends IPagination {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  supplierId?: string;
}

export interface IIncomeAddEditPaymentParams extends IPaymentType {
  id?: string,
  orderId?: string,
  supplierId: string,
}
