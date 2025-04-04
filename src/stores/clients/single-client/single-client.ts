import { makeAutoObservable } from 'mobx';
import { clientsInfoApi, IClientsInfo, IGetClientDeedParams, IGetClientsInfoParams } from '@/api/clients';
import { addNotification } from '@/utils';
import { ISingleClientTabs } from './types';
import { IClientsPayments, IGetClientsPaymentsParams } from '@/api/payment/types';
import { paymentApi } from '@/api/payment';

class SingleClientStore {
  activeClient: IClientsInfo | null = null;
  activeTabs: ISingleClientTabs = ISingleClientTabs.ORDER;
  #today = new Date();

  // PAYMENTS
  paymentPage = 1;
  paymentPageSize = 10;
  paymentSearch: string | null = null;
  isOpenAddEditPaymentModal = false;
  singlePayment: IClientsPayments | null = null;
  startDate: Date | null = this.#today;
  endDate: Date | null = this.#today;

  constructor() {
    makeAutoObservable(this);
  }

  getSingleClient = (clientId: string) =>
    clientsInfoApi.getSingleClient(clientId)
      .then(res => {
        if (res) {
          this.setActiveClient(res);

          return res;
        }
      })
      .catch(addNotification);

  setActiveClient = (activeClient: IClientsInfo | null) => {
    this.activeClient = activeClient;
  };

  setActiveTabs = (activeTabs: ISingleClientTabs) => {
    this.activeTabs = activeTabs;
  };

  // PAYMENTS
  getSingleClientsPayments = (params: IGetClientsPaymentsParams) =>
    paymentApi.getPayments(params)
      .then(res => res)
      .catch(addNotification);

  setPaymentPage = (paymentPage: number) => {
    this.paymentPage = paymentPage;
  };

  setPaymentPageSize = (paymentPageSize: number) => {
    this.paymentPageSize = paymentPageSize;
  };

  setPaymentSearch = (paymentSearch: string | null) => {
    this.paymentSearch = paymentSearch;
  };

  setIsOpenAddEditPaymentModal = (isOpenAddEditPaymentModal: boolean) => {
    this.isOpenAddEditPaymentModal = isOpenAddEditPaymentModal;
  };

  setSinglePayment = (singlePayment: IClientsPayments | null) => {
    this.singlePayment = singlePayment;
  };

  // DEED
  getClientDeed = (params: IGetClientDeedParams) =>
    clientsInfoApi.getClientDeed(params)
      .then(res => res)
      .catch(addNotification);

  setStartDate = (startDate: Date | null) => {
    this.startDate = startDate;
  };

  setEndDate = (endDate: Date | null) => {
    this.endDate = endDate;
  };

  reset() {
    this.activeClient = null;
    this.activeTabs = ISingleClientTabs.ORDER;
  }
}

export const singleClientStore = new SingleClientStore();
