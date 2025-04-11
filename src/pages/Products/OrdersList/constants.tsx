import React from 'react';
import { ColumnType } from 'antd/es/table';
import { IClientsInfo, ISupplierInfo } from '@/api/clients';
import { Action } from './Action';
import { formatPhoneNumber } from '@/utils/phoneFormat';
import { IOrder, IOrderProducts, ITotalOrderPaymentCalc } from '@/api/order/types';
import { Tag } from 'antd';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { priceFormat } from '@/utils/priceFormat';
import { ClientNameLink } from '@/pages/ActionComponents/ClientNameLink';
import { PaymentStatus } from './PaymentStatus';

export const ordersColumns: ColumnType<IOrder>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'client',
    dataIndex: 'client',
    title: 'Mijoz',
    align: 'center',
    width: '300px',
    render: (value, record) => <ClientNameLink client={record?.client} />,
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Sotuv holati',
    align: 'center',
    render: (value, record) => (
      <Tag
        color={OrderStatusColor[String(record?.accepted)]}
      >
        {OrderStatus[String(record?.accepted)]}
      </Tag>
    ),
  },
  {
    key: 'payment',
    dataIndex: 'payment',
    title: 'To\'lov holati',
    align: 'center',
    render: (value, record) => <PaymentStatus order={record} />,
  },
  {
    key: 'seller',
    dataIndex: 'seller',
    title: 'Sotuvchi',
    align: 'center',
    render: (value, record) => <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.seller?.name}</p>,
  },
  {
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    sorter: (a, b) => a?.sum - b?.sum,
    render: (value, record) => priceFormat(record?.sum),
  },
  {
    key: 'totalPay',
    dataIndex: 'totalPay',
    title: 'Jami to\'lov',
    align: 'center',
    width: '120px',
    render: (value, record) => priceFormat(record?.payment?.totalPay),
  },
  {
    key: 'cash',
    dataIndex: 'cash',
    title: 'Naqd to\'lov',
    align: 'center',
    width: '120px',
    render: (value, record) => priceFormat(record?.payment?.cash),
  },
  {
    key: 'card',
    dataIndex: 'card',
    title: 'Bank kartasi orqali to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.payment?.card),
  },
  {
    key: 'transfer',
    dataIndex: 'transfer',
    title: 'Bank o\'tkazmasi orqali to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.payment?.transfer),
  },
  {
    key: 'other',
    dataIndex: 'other',
    title: 'Boshqa usullar bilan to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.payment?.other),
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Qarzga',
    align: 'center',
    width: '130px',
    sorter: (a, b) => a?.debt - b?.debt,
    render: (value, record) => priceFormat(record?.debt),
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Sotilgan vaqti',
    align: 'center',
    width: '120px',
    render: (value, record) => getFullDateFormat(record?.sellingDate),
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action orders={record} />,
  },
];


export const OrderStatus: Record<string, string> = {
  true: 'Tasdiqlangan',
  false: 'Tasdiqlanmagan',
};

export const OrderStatusColor: Record<string, string> = {
  true: '#178c03',
  false: '#ff7700',
};

export const ordersInfoColumns: ColumnType<IOrder>[] = [
  {
    key: 'articl',
    dataIndex: 'articl',
    title: 'Sotuv raqami',
    align: 'center',
    width: '150px',
    render: (value, record) => record?.articl,
  },
  {
    key: 'client',
    dataIndex: 'client',
    title: 'Mijoz',
    align: 'center',
    render: (value, record) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 0' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.client?.name}</p>
        <i>+{record?.client?.phone}</i>
      </div>
    ),
  },
  {
    key: 'seller',
    dataIndex: 'seller',
    title: 'Sotuvchi',
    align: 'center',
    render: (value, record) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5px 0' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.seller?.name}</p>
        <i>+{record?.seller?.phone}</i>
      </div>
    ),
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Sotuv holati',
    align: 'center',
    render: (value, record) => (
      <Tag
        color={OrderStatusColor[String(record?.accepted)]}
      >
        {OrderStatus[String(record?.accepted)]}
      </Tag>
    ),
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Sotilgan vaqti',
    align: 'center',
    width: '150px',
    render: (value, record) => getFullDateFormat(record?.sellingDate),
  },
];


export const ordersInfoPaymentColumns: ColumnType<IOrder>[] = [
  {
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.sum),
  },
  {
    key: 'totalPay',
    dataIndex: 'totalPay',
    title: 'Jami to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.payment?.totalPay),
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Qarzga',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.debt),
  },
  {
    key: 'cash',
    dataIndex: 'cash',
    title: 'Naqd to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.payment?.cash),
  },
  {
    key: 'card',
    dataIndex: 'card',
    title: 'Bank kartasi orqali to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.payment?.card),
  },
  {
    key: 'transfer',
    dataIndex: 'transfer',
    title: 'Bank o\'tkazmasi orqali to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.payment?.transfer),
  },
  {
    key: 'other',
    dataIndex: 'other',
    title: 'Boshqa usullar bilan to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.payment?.other),
  },
];

export const ordersInfoProductsColumns: ColumnType<IOrderProducts>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: 100,
    render: (value, record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Mahsulot nomi',
    align: 'center',
    width: '150px',
    render: (value, record) => record?.product?.name,
  },
  {
    key: 'count',
    dataIndex: 'count',
    title: 'Soni',
    align: 'center',
    width: '150px',
    render: (value, record) => `${record?.count} ${record?.product?.unit}`,
  },
  {
    key: 'cost',
    dataIndex: 'cost',
    title: 'Sotish narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.price),
  },
  {
    key: 'total',
    dataIndex: 'total',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.count * record?.price),
  },
];


export const ordersTotalCalc: ColumnType<ITotalOrderPaymentCalc>[] = [
  {
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    title: 'Jami narxi',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalSum),
  },
  {
    key: 'totalPay',
    dataIndex: 'totalPay',
    title: 'Jami to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalPay),
  },
  {
    key: 'cash',
    dataIndex: 'cash',
    title: 'Jami - Naqd to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalCash),
  },
  {
    key: 'card',
    dataIndex: 'card',
    title: 'Jami - Bank kartasi orqali to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalCard),
  },
  {
    key: 'transfer',
    dataIndex: 'transfer',
    title: 'Jami - Bank o\'tkazmasi orqali to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalTransfer),
  },
  {
    key: 'other',
    dataIndex: 'other',
    title: 'Jami - Boshqa usullar bilan to\'lov',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalOther),
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Jami - Qarzga',
    align: 'center',
    width: '150px',
    render: (value, record) => priceFormat(record?.totalDebt),
  },
];

export const FilterOrderStatusOptions = [
  {
    value: 'true',
    label: (
      <Tag
        color={OrderStatusColor[String(true)]}
        style={{width: '100%', fontSize: '14px'}}
      >
        {OrderStatus[String(true)]}
      </Tag>
    ),
  },
  {
    value: 'false',
    label: (
      <Tag
        color={OrderStatusColor[String(false)]}
        style={{width: '100%', fontSize: '14px'}}
      >
        {OrderStatus[String(false)]}
      </Tag>
    ),
  },
];
