import { makeAutoObservable } from 'mobx';
import { addNotification } from '@/utils';
import { IExpenses, IGetExpensesParams } from '@/api/expenses/types';
import { expensesApi } from '@/api/expenses';

class ExpensesStore {
  #today = new Date();

  pageNumber = 1;
  pageSize = 20;
  search: string | null = null;
  isOpenAddEditExpensesModal = false;
  singleExpenses: IExpenses | null = null;
  startDate: Date | null = this.#today;
  endDate: Date | null = this.#today;

  constructor() {
    makeAutoObservable(this);
  }

  getExpenses = (params: IGetExpensesParams) =>
    expensesApi.getExpenses(params)
      .then(res => res)
      .catch(addNotification);

  setPageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  setPageSize = (pageSize: number) => {
    this.pageSize = pageSize;
  };

  setSearch = (search: string | null) => {
    this.search = search;
  };

  setIsOpenAddEditExpensesModal = (isOpenAddEditExpensesModal: boolean) => {
    this.isOpenAddEditExpensesModal = isOpenAddEditExpensesModal;
  };

  setSingleExpenses = (singleExpenses: IExpenses | null) => {
    this.singleExpenses = singleExpenses;
  };

  setStartDate = (startDate: Date | null) => {
    this.startDate = startDate;
  };

  setEndDate = (endDate: Date | null) => {
    this.endDate = endDate;
  };

  reset = () => {
    this.pageNumber = 1;
    this.pageSize = 10;
    this.search = null;
    this.isOpenAddEditExpensesModal = false;
  };
}

export const expensesStore = new ExpensesStore();
