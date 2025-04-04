/* eslint-disable import/namespace */
import React, {Suspense} from 'react';
import {Navigate, useRoutes} from 'react-router-dom';
import {Loading} from '@/components';
import {ROUTES} from '@/constants';
import {Layout} from '@/modules/Layout';
import {
  ClientsInfo,
  ClientsPayments,
  IncomeProducts,
  Login,
  MyProfileHome,
  Orders,
  ProductsList,
  ReturnedOrders,
  SingleClient,
  SingleSupplier,
  Staffs,
  StaffsPayments,
  Statistic,
  SupplierInfo,
  SupplierPayments,
} from './lazy';
import {ProtectedRoutes} from './ProtectedRoutes';
import {PublicRoutes} from './PublicRoutes';

type Props = {
  isAuth: boolean | null;
};

export const Router = ({isAuth}: Props) => useRoutes([
  {
    path: ROUTES.home,
    element: <ProtectedRoutes isAuth={isAuth} />,
    children: [
      {
        path: ROUTES.home,
        element: <Layout />,
        children: [
          // ADMIN
          {
            element: <Suspense fallback={<Loading />}><Statistic /></Suspense>,
            path: ROUTES.home,
            index: true,
          },
          // STAFFS
          {
            element: <Suspense fallback={<Loading />}><Staffs /></Suspense>,
            path: ROUTES.workersStaffs,
          },
          {
            element: <Suspense fallback={<Loading />}><StaffsPayments /></Suspense>,
            path: ROUTES.workersStaffsPayments,
          },
          // CLIENTS
          {
            element: <Suspense fallback={<Loading />}><ClientsInfo /></Suspense>,
            path: ROUTES.clientsInfo,
          },
          {
            element: <Suspense fallback={<Loading />}><SingleClient /></Suspense>,
            path: ROUTES.clientsSingleClient,
          },
          {
            element: <Suspense fallback={<Loading />}><ClientsPayments /></Suspense>,
            path: ROUTES.clientsPayments,
          },
          // SUPPLIER
          {
            element: <Suspense fallback={<Loading />}><SupplierInfo /></Suspense>,
            path: ROUTES.supplierInfo,
          },
          {
            element: <Suspense fallback={<Loading />}><SupplierPayments /></Suspense>,
            path: ROUTES.supplierPayments,
          },
          {
            element: <Suspense fallback={<Loading />}><SingleSupplier /></Suspense>,
            path: ROUTES.supplierSingleSupplier,
          },
          // PRODUCTS
          {
            element: <Suspense fallback={<Loading />}><ProductsList /></Suspense>,
            path: ROUTES.productsList,
          },
          {
            element: <Suspense fallback={<Loading />}><IncomeProducts /></Suspense>,
            path: ROUTES.productsIncome,
          },
          {
            element: <Suspense fallback={<Loading />}><Orders /></Suspense>,
            path: ROUTES.productsOrder,
          },
          {
            element: <Suspense fallback={<Loading />}><ReturnedOrders /></Suspense>,
            path: ROUTES.productsReturnedOrder,
          },
          // SETTING ROUTES
          {
            element: <Navigate to={ROUTES.home} />,
            path: '*',
          },
          {
            element: <Navigate to={ROUTES.home} />,
            path: '/',
          },
        ],
      },
    ],
  },
  {
    path: ROUTES.signIn,
    element: <PublicRoutes isAuth={isAuth} />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<Loading />}><Login /></Suspense>,
      },
    ],
  },
]);
