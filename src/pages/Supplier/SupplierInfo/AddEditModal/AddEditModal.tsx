import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {Form, Input, InputNumber, Modal} from 'antd';
import {addNotification} from '@/utils';
import {regexPhoneNumber} from '@/utils/phoneFormat';
import { IAddClientInfo, IUpdateUser, clientsInfoApi } from '@/api/clients';
import { supplierInfoStore } from '@/stores/supplier';

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const {mutate: addNewSupplier} =
    useMutation({
      mutationKey: ['addNewSupplier'],
      mutationFn: (params: IAddClientInfo) => clientsInfoApi.addSupplier(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getSuppliers']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const {mutate: updateSupplier} =
    useMutation({
      mutationKey: ['updateSupplier'],
      mutationFn: (params: IUpdateUser) => clientsInfoApi.updateUser(params),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['getSuppliers']});
        handleModalClose();
      },
      onError: addNotification,
      onSettled: async () => {
        setLoading(false);
      },
    });

  const handleSubmit = (values: IAddClientInfo) => {
    const valueControl = {
      ...values,
      phone: `998${values?.phone}`,
    };

    setLoading(true);

    if (supplierInfoStore?.singleSupplierInfo) {
      updateSupplier({
        ...valueControl,
        id: supplierInfoStore?.singleSupplierInfo?.id!,
      });

      return;
    }
    addNewSupplier(valueControl);
  };

  const handleModalClose = () => {
    supplierInfoStore.setSingleSupplierInfo(null);
    supplierInfoStore.setIsOpenAddEditSupplierModal(false);
  };

  const handleModalOk = () => {
    form.submit();
  };

  useEffect(() => {
    if (supplierInfoStore.singleSupplierInfo) {
      form.setFieldsValue({
        ...supplierInfoStore.singleSupplierInfo,
        phone: supplierInfoStore.singleSupplierInfo?.phone?.slice(3),
      });
    }
  }, [supplierInfoStore.singleSupplierInfo]);

  return (
    <Modal
      open={supplierInfoStore.isOpenAddEditSupplierModal}
      title={supplierInfoStore.singleSupplierInfo ? 'Yetkazib beruvchini tahrirlash' : 'Yetkazib beruvchini qo\'shish'}
      onCancel={handleModalClose}
      onOk={handleModalOk}
      okText={supplierInfoStore.singleSupplierInfo ? 'Yetkazib beruvchini tahrirlash' : 'Yetkazib beruvchini qo\'shish'}
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
          name="name"
          label="Mijoz"
          rules={[{required: true}]}
        >
          <Input placeholder="F.I.O" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Telefon raqami: 901234567"
          rules={[
            {required: true},
            {
              pattern: regexPhoneNumber,
              message: 'Raqamni to\'g\'ri kiriting!, Masalan: 901234567',
            },
          ]}
        >
          <InputNumber
            addonBefore="+998"
            placeholder="Telefon raqami"
            style={{width: '100%'}}
            type="number"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
});
