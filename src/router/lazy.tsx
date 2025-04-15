import {lazy} from 'react';
import {Loading} from '@/components';

const handleCatchChunkError = () => {
  window.location.reload();

  return {default: Loading};
};

// HOME
export const Statistic = lazy(() =>
  import('@/pages/Home').then(({Statistic}) => ({default: Statistic})).catch(handleCatchChunkError));

export const MyProfileHome = lazy(() =>
  import('@/pages/MyProfile').then(({MyProfile}) => ({default: MyProfile})).catch(handleCatchChunkError));

export const Login = lazy(() =>
  import('@/pages/Login').then(({Login}) => ({default: Login})).catch(handleCatchChunkError));

// STAFFS
export const Staffs = lazy(() =>
  import('@/pages/Workers').then(({Staffs}) => ({default: Staffs})).catch(handleCatchChunkError));

export const StaffsPayments = lazy(() =>
  import('@/pages/Workers').then(({StaffsPayments}) => ({default: StaffsPayments})).catch(handleCatchChunkError));

export const Expenses = lazy(() =>
  import('@/pages/Workers').then(({Expenses}) => ({default: Expenses})).catch(handleCatchChunkError));

// CLIENTS
export const ClientsInfo = lazy(() =>
  import('@/pages/Clients').then(({ClientsInfo}) => ({default: ClientsInfo})).catch(handleCatchChunkError));

export const SingleClient = lazy(() =>
  import('@/pages/Clients').then(({SingleClient}) => ({default: SingleClient})).catch(handleCatchChunkError));

export const ClientsPayments = lazy(() =>
  import('@/pages/Clients').then(({ClientsPayments}) => ({default: ClientsPayments})).catch(handleCatchChunkError));

// SUPPLIER
export const SupplierInfo = lazy(() =>
  import('@/pages/Supplier').then(({SupplierInfo}) => ({default: SupplierInfo})).catch(handleCatchChunkError));

export const SupplierPayments = lazy(() =>
  import('@/pages/Supplier').then(({SupplierPayments}) => ({default: SupplierPayments})).catch(handleCatchChunkError));

export const SingleSupplier = lazy(() =>
  import('@/pages/Supplier').then(({SingleSupplier}) => ({default: SingleSupplier})).catch(handleCatchChunkError));

// PRODUCTS
export const ProductsList = lazy(() =>
  import('@/pages/Products').then(({ProductsList}) => ({default: ProductsList})).catch(handleCatchChunkError));

export const IncomeProducts = lazy(() =>
  import('@/pages/Products').then(({IncomeProducts}) => ({default: IncomeProducts})).catch(handleCatchChunkError));

export const Orders = lazy(() =>
  import('@/pages/Products').then(({Orders}) => ({default: Orders})).catch(handleCatchChunkError));

export const ReturnedOrders = lazy(() =>
  import('@/pages/Products').then(({ReturnedOrders}) => ({default: ReturnedOrders})).catch(handleCatchChunkError));
