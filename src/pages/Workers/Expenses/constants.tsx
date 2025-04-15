import React from 'react';
import { ColumnType } from 'antd/es/table';
import { Action } from './Action';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { IExpenses } from '@/api/expenses/types';

export const expensesColumns: ColumnType<IExpenses>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Chiqim qiymati',
    align: 'center',
    width: 200,
    render: (value, record) => <span>{priceFormat(record?.sum)}</span>,
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Ma\'lumot',
    align: 'center',
    render: (value, record) => <span>{record?.info}</span>,
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Chiqim vaqti',
    align: 'center',
    width: 200,
    render: (value, record) => <span>{getFullDateFormat(record?.createdAt)}</span>,
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    width: 200,
    render: (value, record) => <Action expenses={record} />,
  },
];
