import React from 'react';
import { ColumnType } from 'antd/es/table';
import { priceFormat } from '@/utils/priceFormat';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { ISupplierDeed } from '@/api/clients';
import { ArrowRightOutlined } from '@ant-design/icons';

export const deedColumns: ColumnType<ISupplierDeed>[] = [
  {
    key: 'index',
    dataIndex: 'index',
    title: '#',
    align: 'center',
    width: '40px',
    render: (value, record, index) => index + 1,
  },
  {
    key: 'data',
    dataIndex: 'data',
    title: 'Vaqti',
    align: 'center',
    width: '100px',
    render: (value, record) => (
      record?.type === 'order'
        ? getFullDateFormat(record?.createdAt!)
        : getFullDateFormat(record?.updatedAt)
    ),
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: 'Harakat turi',
    width: '250px',
    render: (value, record) => (
      <>
        {record?.type === 'order' ? 'Tushirish' : 'Qarzga to\'lov'}
        {<ArrowRightOutlined />}
        <p
          style={{ margin: 0, color: 'blue', display: 'inline' }}
        >
          №: {record?.type === 'order' ? record?.articl : record?.id}
        </p>
      </>
    ),
  },
  {
    key: 'debt',
    dataIndex: 'debt',
    title: 'Дебит',
    align: 'center',
    width: '50px',
    className: 'green-col',
    render: (value, record) => (
      record?.type === 'order'
        ? priceFormat(record?.sum)
        : null
    ),
  },
  {
    key: 'data',
    dataIndex: 'data',
    title: 'Кредит',
    align: 'center',
    width: '50px',
    className: 'red-col',
    render: (value, record) => (
      record?.type === 'payment'
        ? priceFormat(record?.totalPay)
        : null
    ),
  },
];
