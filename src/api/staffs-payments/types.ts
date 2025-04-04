import { ISeller } from "../clients";
import { IPagination } from "../types";

export interface IGetStaffsPaymentsParams extends IPagination {
  sellerId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IStaffsPayments {
  id: string;
  sum: string;
  description: string;
  createdAt: string;
  employee: ISeller;
}

export interface IAddEditStaffsPayment {
  id?: string;
  sum: number;
  description: string;
  employeeId: string
}
