import React, { FC } from 'react';
import { observer } from 'mobx-react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Popconfirm } from 'antd';
import { addNotification } from '@/utils';
import { ISupplierPayments } from '@/api/payment-income/types';
import { supplierPaymentsStore } from '@/stores/supplier';
import { incomePaymentApi } from '@/api/payment-income';

type Props = {
  supplierPayment: ISupplierPayments;
};

export const Action: FC<Props> = observer(({ supplierPayment }) => {
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split('T')[0];
  const checkDate = supplierPayment?.createdAt.split('T')[0];
  const isToday = checkDate === today;

  const { mutate: deletePayment } =
    useMutation({
      mutationKey: ['deletePayment'],
      mutationFn: (id: string) => incomePaymentApi.deleteIncomePayment(id!),
      onSuccess: () => {
        addNotification('To\'lov o\'chirildi');
        queryClient.invalidateQueries({ queryKey: ['getPayments'] });
      },
      onError: addNotification,
    });

  const handleEditPayment = () => {
    supplierPaymentsStore.setSinglePayment(supplierPayment);
    supplierPaymentsStore.setIsOpenAddEditPaymentModal(true);
  };

  const handleDeletePayment = () => {
    deletePayment(supplierPayment?.id);
  };

  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
      {isToday && (
        <>
          <Button onClick={handleEditPayment} type="primary" icon={<EditOutlined />} />
          <Popconfirm
            title="To'lovni o'chirish"
            description="Rostdan ham bu to'lovni o'chirishni xohlaysizmi?"
            onConfirm={handleDeletePayment}
            okText="Ha"
            okButtonProps={{ style: { background: 'red' } }}
            cancelText="Yo'q"
          >
            <Button type="primary" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      )}
    </div>
  );
});
