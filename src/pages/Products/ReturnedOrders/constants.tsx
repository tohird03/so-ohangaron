import React from 'react';
import {ColumnType} from 'antd/es/table';
import {Action} from './Action';
import { priceFormat } from '@/utils/priceFormat';
import { IReturnedOrder } from '@/api/returned-order/types';
import { ClientNameLink } from '@/pages/ActionComponents/ClientNameLink';
import { Tag } from 'antd';
import { OrderStatus, OrderStatusColor } from '../OrdersList/constants';
import { getFullDateFormat } from '@/utils/getDateFormat';

export const returnedOrdersColumns: ColumnType<IReturnedOrder>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'name',
    dataIndex: 'name',
    title: 'Mijoz',
    align: 'center',
    render: (value, record) => <ClientNameLink client={record?.client} />,
  },
  {
    key: 'sum',
    dataIndex: 'sum',
    title: 'Jami narxi',
    align: 'center',
    render: (value, record) => priceFormat(record?.sum),
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'Qaytaruv holati',
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
    key: 'fromClient',
    dataIndex: 'fromClient',
    title: 'Mijozning hisobidan',
    align: 'center',
    render: (value, record) => priceFormat(record?.fromClient),
  },
  {
    key: 'cash',
    dataIndex: 'cash',
    title: 'Naqd to\'lov',
    align: 'center',
    render: (value, record) => priceFormat(record?.cashPayment),
  },
  {
    key: 'seller',
    dataIndex: 'seller',
    title: 'Sotuvchi',
    align: 'center',
    render: (value, record) => (
      <div>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{record?.seller?.name}</p>
        <i>+{record?.seller?.phone}</i>
      </div>
    ),
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Qaytarilgan sanasi',
    align: 'center',
    width: '150px',
    render: (value, record) => getFullDateFormat(record?.returnedDate),
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'O\'zgartirish',
    align: 'center',
    width: '150px',
    render: (value, record) => <Action returnedOrder={record} />,
  },
];
