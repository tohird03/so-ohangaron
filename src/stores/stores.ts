import {appStore} from './app';
import {authStore} from './auth';
import {breadcrumbStore} from './breadcrumb';
import {profileStore} from './profile';
import {clientsInfoStore, paymentsStore, singleClientStore} from './clients';
import {staffsStore} from './workers';
import {supplierInfoStore, supplierPaymentsStore, singleSupplierStore} from './supplier';
import {productsListStore, incomeProductsStore, ordersStore, returnedOrdersStore} from './products';

export const stores = {
  appStore,
  authStore,
  breadcrumbStore,
  profileStore,
  staffsStore,
  clientsInfoStore,
  paymentsStore,
  singleClientStore,
  supplierInfoStore,
  supplierPaymentsStore,
  singleSupplierStore,
  productsListStore,
  incomeProductsStore,
  ordersStore,
  returnedOrdersStore,
};

export const resetStores = () => {
  appStore.reset();
  authStore.reset();
  breadcrumbStore.reset();
  profileStore.reset();
  staffsStore.reset();
  clientsInfoStore.reset();
  paymentsStore.reset();
  singleClientStore.reset();
  supplierInfoStore.reset();
  supplierPaymentsStore.reset();
  singleSupplierStore.reset();
  productsListStore.reset();
  incomeProductsStore.reset();
  ordersStore.reset();
  returnedOrdersStore.reset();
};
