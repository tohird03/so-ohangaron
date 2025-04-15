import React, {useEffect, useMemo, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Input, InputNumber, Modal, Select} from 'antd';
import {addNotification} from '@/utils';
import { priceFormat } from '@/utils/priceFormat';
import { IAddEditStaffsPayment } from '@/api/staffs-payments/types';
import { staffsPaymentsApi } from '@/api/staffs-payments/staffs-payments';
import { expensesStore } from '@/stores/workers';
import { IAddEditExpenses } from '@/api/expenses/types';
import { expensesApi } from '@/api/expenses';

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {mutate: addNewExpenses} =
    useMutation({
      mutationKey: ['addNewExpenses'],
      mutationFn: (params: IAddEditExpenses) => expensesApi.addExpenses(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getExpenses']});
        addNotification('To\'lov muvaffaqiyatli qo\'shildi');
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updateExpenses} =
    useMutation({
      mutationKey: ['updateExpenses'],
      mutationFn: (params: IAddEditExpenses) => expensesApi.updateExpenses(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getExpenses']});
        addNotification('To\'lov muvaffaqiyatli tahrirlandi');
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (values: IAddEditExpenses) => {
    setLoading(true);

    if (expensesStore?.singleExpenses) {
      updateExpenses({
        ...values,
        id: expensesStore?.singleExpenses?.id!,
      });

      return;
    }
    addNewExpenses(values);
  };

  const handleModalClose = () => {
    expensesStore.setSingleExpenses(null);
    expensesStore.setIsOpenAddEditExpensesModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (expensesStore.singleExpenses) {
      form.setFieldsValue({
        ...expensesStore.singleExpenses,
      });
    }
  }, [expensesStore.singleExpenses]);

  return (
    <Modal
      open={expensesStore.isOpenAddEditExpensesModal}
      title={expensesStore.singleExpenses ? 'Harajatni tahrirlash' : 'Harajatni qo\'shish'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={expensesStore.singleExpenses ? 'Harajatni tahrirlash' : 'Harajatni qo\'shish'}
      cancelText="Bekor qilish"
      centered
      confirmLoading={loading}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Harajat qiymati"
          name="sum"
          initialValue={0}
        >
          <InputNumber
            placeholder="Chiqim qiymati"
            defaultValue={0}
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>

        <Form.Item
          label="Harajat haqida ma'lumot"
          name="info"
        >
          <Input.TextArea
            placeholder="To'lov haqida ma'lumot"
            style={{ width: '100%' }}
            rows={4}
            maxLength={100}
            showCount
            autoSize={{ minRows: 2, maxRows: 6 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
