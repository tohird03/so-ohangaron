import { IPagination } from "../types";

export interface IGetExpensesParams extends IPagination {
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IExpenses {
  id: string;
  sum: number;
  info: string;
  createdAt: string;
}

export interface IAddEditExpenses {
  id?: string;
  sum: number;
  info: string;
}
