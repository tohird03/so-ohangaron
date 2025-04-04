import {TStage} from './types';
export const stage = process.env.REACT_APP_STAGE || 'dev';

export enum Endpoints {
  Base = '',

  // SETTINGS
  SignIn = '/admin/sign-in',
  RefreshToken = '/dashboard-auth/refresh',
  UserProfile = '/admin/profile',

  // STAFFS
  Staffs = '/admin',
  StaffsPayments = '/employeePayment',

  // CLIENTS
  Users = '/user',
  Clients = '/user/client',
  ClientsDeed = '/user/client/deed',
  SupplierDeed = '/user/supplier/deed',
  Supplier = '/user/supplier',
  ClientDeedExcelUpload = '/user/client/deed/upload',
  SupplierDeedExcelUpload = '/user/supplier/deed/upload',
  UploadClient = '/user/client/debtors',

  // PRODUCTS
  products = '/product',
  productsIncomeOrder = '/incomingOrder',
  productsIncomeOrderProduct = '/incomingProduct',
  productsOrder = '/Order',
  productsOrderStatistic = '/Order/statistica',
  productsOrderProduct = '/orderProduct',
  productsOrderExel = '/Order/upload',
  productsIncomeOrderExel = '/incomingOrder/upload',
  productsReturnedOrderExel = '/returned-order/upload',

  // PAYMENT
  payment = '/payment',
  paymentUpload = '/payment/upload',
  incomePayment = '/incomingOrderPayment',

  // ROLES
  role = '/role',

  // RETURNED ORDER
  returnedOrder = '/returned-order',
  returnedProduct = '/returned-product',
}

const config: Record<string, TStage> = {
  dev: {
    apiUrl: 'https://santexnika.mirabdulloh.uz',
  },
  prod: {
    apiUrl: 'https://santexnika.mirabdulloh.uz',
  },
};

const imgConfig: Record<string, TStage> = {
  dev: {
    apiUrl: 'https://minio.mydevops.uz/',
  },
  prod: {
    apiUrl: 'https://minio.mydevops.uz/',
  },
};


export const umsStages = config[stage];
export const imgStages = imgConfig[stage];
