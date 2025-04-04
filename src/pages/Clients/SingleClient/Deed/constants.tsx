import React from 'react';
import { ColumnType } from 'antd/es/table';
import { priceFormat } from '@/utils/priceFormat';
import { IClientsPayments } from '@/api/payment/types';
import { getFullDateFormat } from '@/utils/getDateFormat';
import { IDeed } from '@/api/clients';
import { ArrowRightOutlined } from '@ant-design/icons';

export const deedColumns: ColumnType<IDeed>[] = [
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
        ? getFullDateFormat(record?.sellingDate)
        : record?.type === 'payment'
          ? getFullDateFormat(record?.updatedAt)
          : record?.type === 'returned-order'
            ? getFullDateFormat(record?.returnedDate)
            : ''
    ),
  },
  {
    key: 'type',
    dataIndex: 'type',
    title: 'Harakat turi',
    width: '250px',
    render: (value, record) => (
      <>
        {
          record?.type === 'order'
            ? 'Sotuv'
            : record?.type === 'payment'
              ? 'To\'lov'
              : record?.type === 'returned-order'
                ? 'Qaytaruv'
                : ''
        }
        {<ArrowRightOutlined />}
        <p
          style={{ margin: 0, color: 'blue', display: 'inline' }}
        >
          №: {
            record?.type === 'order'
              ? record?.articl
              : record?.type === 'payment'
                ? record?.id
                : record?.type === 'returned-order'
                  ? record?.id
                  : ''
          }
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
        : record?.type === 'returned-order'
          ? priceFormat((record?.fromClient || 0))
          : null
    ),
  },
  {
    key: 'description',
    dataIndex: 'description',
    title: 'Ma\'lumot',
    align: 'center',
    width: '50px',
    render: (value, record) => <span>{record?.description}</span>,
  },
];
