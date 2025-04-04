import React from 'react';
import {ColumnType} from 'antd/es/table';
import {Action} from './Action';
import { IProducts } from '@/api/product/types';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { priceFormat } from '@/utils/priceFormat';

export const productsListColumn: ColumnType<IProducts>[] = [
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
    title: 'Mahsulot nomi',
    align: 'center',
    render: (value, record) => record?.name,
  },
  {
    key: 'count',
    dataIndex: 'count',
    title: 'Qoldiq',
    align: 'center',
    render: (value, record) => `${record?.count} dona`,
  },
  {
    key: 'cost',
    dataIndex: 'cost',
    title: 'Sotib olingan narxi',
    align: 'center',
    render: (value, record) => record?.cost,
  },
  {
    key: 'selling_price',
    dataIndex: 'selling_price',
    title: 'Sotilish narxi',
    align: 'center',
    render: (value, record) => record?.selling_price,
  },
  {
    key: 'totalPrice',
    dataIndex: 'totalPrice',
    title: 'Umumiy qiymati',
    align: 'center',
    render: (value, record) => {
      const totalSellingPrice = record?.cost * record?.count;

      return priceFormat(totalSellingPrice);
    },
  },
  {
    key: 'min_amount',
    dataIndex: 'min_amount',
    title: 'Ogohlantirish',
    align: 'center',
    render: (value, record) => `${record?.min_amount} dona`,
  },
  {
    key: 'createdAt',
    dataIndex: 'createdAt',
    title: 'Yaratilgan vaqti',
    align: 'center',
    render: (value, record) => getFullDateFormat(record?.createdAt),
  },
  {
    key: 'lastSale',
    dataIndex: 'lastSale',
    title: 'Oxirgi sotuv',
    align: 'center',
    render: (value, record) => getFullDateFormat(record?.lastSale),
  },
  {
    key: 'action',
    dataIndex: 'action',
    title: 'Action',
    align: 'center',
    render: (value, record) => <Action product={record} />,
  },
];
