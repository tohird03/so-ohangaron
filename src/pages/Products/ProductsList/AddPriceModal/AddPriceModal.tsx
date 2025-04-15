import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { addNotification } from '@/utils';
import { productsListStore } from '@/stores/products';
import { priceFormat } from '@/utils/priceFormat';
import { productsApi } from '@/api/product/product';

export const AddPriceModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { mutate: changePriceModal } =
    useMutation({
      mutationKey: ['changePriceModal'],
      mutationFn: (percentage: number) => productsApi.changePriceModal(percentage),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['getProducts'] });
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (values: {percentage: number}) => {
    setLoading(true);

    changePriceModal(values?.percentage);
  };

  const handleModalClose = () => {
    productsListStore.setIsOpenChangePriceModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  return (
    <Modal
      open={productsListStore.isOpenChangePriceModal}
      title={'Mahsulotni narxini o\'zgartirish'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={'Mahsulotni narxini o\'zgartirish'}
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
          label="O'zgartiriladigan foiz %"
          rules={[{ required: true }]}
          name="percentage"
        >
          <InputNumber
            placeholder="Foiz miqdori"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
