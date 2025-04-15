import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm } from 'antd';
import { addNotification } from '@/utils';
import { authStore } from '@/stores/auth';
import { IExpenses } from '@/api/expenses/types';
import { expensesStore } from '@/stores/workers';
import { expensesApi } from '@/api/expenses';

type Props = {
  expenses: IExpenses;
};

export const Action: FC<Props> = observer(({ expenses }) => {
  const queryClient = useQueryClient();

  const { mutate: deleteExpenses } =
    useMutation({
      mutationKey: ['deleteExpenses'],
      mutationFn: (id: string) => expensesApi.deleteExpenses(id!),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getExpenses'] });
      },
      onError: addNotification,
    });

  const handleEditStaffsPayments = () => {
    expensesStore.setSingleExpenses(expenses);
    expensesStore.setIsOpenAddEditExpensesModal(true);
  };

  const handleDelete = () => {
    deleteExpenses(expenses?.id);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
      {authStore?.staffInfo?.role === 'super_admin' && (
        <>
          <Button onClick={handleEditStaffsPayments} type="primary" icon={<EditOutlined />} />
          <Popconfirm
            title="Chiqimni o'chirish"
            description="Rostdan ham bu hisobotni o'chirishni xohlaysizmi?"
            onConfirm={handleDelete}
            okText="Ha"
            okButtonProps={{ style: { background: 'red' } }}
            cancelText="Yo'q"
          >
            <Button type="primary" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      )
      }
    </div>
  );
});
