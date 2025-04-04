import { IClientsInfo, ISeller } from "../clients";
import { IProducts } from "../product/types";
import { IPagination } from "../types";

export interface IGetReturnedOrdersParams extends IPagination {
  search?: string;
  accepted?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IReturnedOrder extends IReturnedOrderPayments {
  id: string,
  sum: number,
  description: string,
  accepted: boolean,
  createdAt: string,
  client: IClientsInfo,
  returnedDate: string,
  seller: ISeller,
  products: IReturnedOrderProducts[]
}

export interface IReturnedOrderProducts {
  id: string,
  cost: number;
  count: number,
  price: number;
  avarage_cost: number;
  product: IProducts;
}

export interface IAddReturnedOrders {
  clientId: string,
  description?: string,
  products: IAddReturnedOrderProducts[];
}

export interface IAddReturnedOrderProducts {
  product_id: string,
  count: number,
  price: number
}

export interface IAddProductsToReturnedOrder extends IAddReturnedOrderProducts {
  order_id?: string;
}

export interface IUpdateReturnedOrder extends IReturnedOrderPayments {
  id: string,
  accepted?: boolean,
  description?: string,
}

export interface IUpdateProductFromReturnedOrders {
  id: string,
  price: number,
  count: number,
}

export interface IReturnedOrderPayments {
  cashPayment?: number,
  fromClient?: number,
}
