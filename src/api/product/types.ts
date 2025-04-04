import { IPagination } from "../types";

export interface IGetProductsParams extends IPagination {
  search?: string;
}


export interface IProducts {
  id: string;
  name: string;
  count: number;
  min_amount: number;
  createdAt: string;
  // Sotib olingan narx
  cost: number;
  // Sotuvda sotiladigan narxi
  selling_price: number;
  // Kelishtirib berishning oxirgi narxi
  wholesale_price: number;
  // Foyda
  avarage_cost: number;
  lastSale: string;
}

export interface IAddEditProduct {
  id?: string;
  min_amount?: number;
  wholesale_price?: number;
  name: string;
  count: number;
  cost: number;
  selling_price: number;
  unit: string;
}

export interface IProductTotalCalc {
  totalProductCount: number,
  totalProductCost: number,
  totalProductPrice: number,
}
