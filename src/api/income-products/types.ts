import { ISupplierInfo } from "../clients";
import { IProducts } from "../product/types"
import { IStaffs } from "../staffs";
import { IPagination, IPayment } from "../types";

export interface IIncomeOrder {
  id: string,
  sum: number,
  debt: number,
  accepted: boolean,
  supplier: ISupplierInfo,
  admin: IStaffs,
  payment: IPayment;
  incomingProducts: IIncomeProduct[];
  createdAt: string;
  sellingDate: string;
}

export interface IIncomeProduct {
  id: string,
  cost: number,
  count: number,
  selling_price: number,
  wholesale_price: number,
  product: IProducts;
}

export interface IGetIncomeOrdersParams extends IPagination {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  supplierId?: string;
}


export interface IAddIncomeOrderProducts {
  product_id: string;
  count: number;
  cost: number;
  selling_price: number;
}

export interface IAddIncomeOrderForm extends IAddIncomeOrderProducts {
  supplierId: string;
  sellingDate: string;
}

export interface IAddEditIncomeOrder {
  supplierId: string;
  products: IAddIncomeOrderProducts[];
  sellingDate: string;
}

export interface IUpdateIncomeOrder {
  id: string;
  supplierId?: string;
  sellingDate?: string;
}

export interface IIncomeOrderPayment {
  supplier?: ISupplierInfo;
  orderId: string;
  payment: IPayment | undefined;
}

export interface IIncomeOrderProductAdd extends IAddIncomeOrderProducts {
  incomingOrderId: string;
}

export interface IIncomeUpdateOrderProduct {
  id: string;
  count: number;
  cost: number;
  selling_price: number;
}
