import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select, Space, Spin, message, notification } from 'antd';
import { observer } from 'mobx-react';
import { ordersStore } from '@/stores/products';
import { priceFormat } from '@/utils/priceFormat';
import { IPaymentType } from '@/api/types';
import { IAddEditPaymentParams } from '@/api/payment/types';
import { paymentApi } from '@/api/payment';
import { addNotification } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { singleClientStore } from '@/stores/clients';
import { useParams } from 'react-router-dom';

export const PaymentModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { clientId } = useParams();
  const [loadingPayment, setLoadingPayment] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const checkDate = ordersStore.order?.sellingDate?.split('T')[0];
  const isToday = checkDate === today;

  const handleModalClose = () => {
    ordersStore.setOrderPayment(null);
    ordersStore.setSingleOrder(null);
    ordersStore.setOrder(null);
    ordersStore.setIsOpenAddEditNewOrderModal(false);
    ordersStore.setIsOpenPaymentModal(false);
  };

  const handleSavePayment = () => {
    form.submit();
  };

  const handleSubmitPayment = (values: IPaymentType) => {
    setLoadingPayment(true);
    const orderPaymentData: IAddEditPaymentParams = {
      ...values,
      orderId: ordersStore.orderPayment?.orderId,
      clientId: ordersStore.orderPayment?.client?.id!,
      sendUser: ordersStore?.isSendUser,
    };

    if (ordersStore.orderPayment?.payment) {
      if (!isToday) {
        message.info('Oldingi to\'lovni o\'zgartirolmaysiz!');

        return;
      }

      paymentApi.updatePayment({
        ...orderPaymentData,
        id: ordersStore.orderPayment?.payment?.id,
      })
        .then(res => {
          queryClient.invalidateQueries({ queryKey: ['getOrders'] });
          addNotification('To\'lov muvaffaqiyatli o\'zgartirildi');
          if (clientId) {
            singleClientStore.getSingleClient(clientId);
          }
          handleModalClose();
        })
        .catch(addNotification)
        .finally(() => {
          setLoadingPayment(false);
        });

      return;
    }

    paymentApi.addPayment(orderPaymentData)
      .then(res => {
        queryClient.invalidateQueries({ queryKey: ['getOrders'] });
        addNotification('To\'lov muvaffaqiyatli amalga oshirildi');
        if (clientId) {
          singleClientStore.getSingleClient(clientId!);
        }
        handleModalClose();
      })
      .catch(addNotification)
      .finally(() => {
        setLoadingPayment(false);
      });
  };

  useEffect(() => {
    if (ordersStore.orderPayment?.payment) {
      const payment = ordersStore?.orderPayment?.payment;

      if (payment) {
        const { cash, card, transfer, other, description }: IPaymentType = payment;

        form.setFieldsValue({
          cash,
          card,
          transfer,
          other,
          description,
          clientId: ordersStore.orderPayment?.client?.id,
        });

        const totalPayCalc = cash + card + transfer + other;

        setTotalPayment(totalPayCalc);
      }
    }

    const totalPriceCalc = ordersStore?.order?.products?.reduce((prev, current) => prev + (current?.price * current?.count), 0);

    setTotalPrice(totalPriceCalc || 0);
  }, [ordersStore.orderPayment, ordersStore?.order?.products]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    const { cash = 0, card = 0, transfer = 0, other = 0 } = allValues;
    const total = [cash, card, transfer, other].reduce(
      (sum, value) => sum + Number(value || 0),
      0
    );

    setTotalPayment(total);
  };

  const handleAddonClick = (fieldName: string) => {
    const allValues = form.getFieldsValue();
    const { cash = 0, card = 0, transfer = 0, other = 0 } = allValues;

    const totalEntered = cash + card + transfer + other;

    const remainingAmount = totalPrice - totalEntered;

    if (remainingAmount > 0) {
      form.setFieldsValue({
        [fieldName]: (allValues[fieldName] || 0) + remainingAmount,
      });
    }

    setTotalPayment(totalPrice);
  };

  return (
    <Modal
      open={ordersStore.isOpenPaymentModal}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <p style={{ margin: 0 }}>
            To&apos;lov {ordersStore.orderPayment?.client?.name}
          </p>
          <p style={{ margin: 0 }}>
            {ordersStore?.order?.client?.debt && `Mijoz qarzi: ${priceFormat(ordersStore?.order?.client?.debt)}`}
          </p>
        </div>
      }
      onCancel={handleModalClose}
      cancelText="Bekor qilish"
      centered
      keyboard
      style={{ top: 0, padding: '20px' }}
      bodyStyle={{
        height: '85vh',
        overflow: 'auto',
      }}
      width="100vw"
      footer={
        <Button
          onClick={handleSavePayment}
          type="primary"
          disabled={!isToday}
          loading={loadingPayment}
        >
          Maqullash
        </Button>
      }
    >
      <Form
        form={form}
        onFinish={handleSubmitPayment}
        layout="vertical"
        autoComplete="off"
        onValuesChange={handleValuesChange}
        className="income-order__add-products-form-info"
      >
        <Form.Item
          label="Mijoz"
          rules={[{ required: true }]}
          name="clientId"
          initialValue={ordersStore.orderPayment?.client?.id}
        >
          <Select
            showSearch
            placeholder="Mijoz"
            optionFilterProp="children"
            options={[{
              value: ordersStore.orderPayment?.client?.id,
              label: `${ordersStore.orderPayment?.client?.name} ${ordersStore.orderPayment?.client?.phone}`,
            }]}
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="Bank kartasi orqali to'lov"
          name="card"
          initialValue={0}
        >
          <InputNumber
            placeholder="Bank kartasi orqali to'lov"
            defaultValue={0}
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
            addonAfter={
              <Button
                disabled={totalPayment >= totalPrice}
                type="primary"
                onClick={handleAddonClick?.bind(null, 'card')}
              >
                Umumiy miqdor
              </Button>
            }
          />
        </Form.Item>
        <Form.Item
          label="Naqd to'lov"
          name="cash"
          initialValue={0}
        >
          <InputNumber
            placeholder="Bank kartasi orqali to'lov"
            defaultValue={0}
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
            addonAfter={
              <Button
                disabled={totalPayment >= totalPrice}
                type="primary"
                onClick={handleAddonClick?.bind(null, 'cash')}
              >
                Umumiy miqdor
              </Button>
            }
          />
        </Form.Item>
        <Form.Item
          label="Bank o'tkazmasi orqali to'lov"
          name="transfer"
          initialValue={0}
        >
          <InputNumber
            placeholder="Bank o'tkazmasi orqali to'lov"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
            addonAfter={
              <Button
                disabled={totalPayment >= totalPrice}
                type="primary"
                onClick={handleAddonClick?.bind(null, 'transfer')}
              >
                Umumiy miqdor
              </Button>
            }
          />
        </Form.Item>
        <Form.Item
          label="Boshqa usullar bilan to'lov"
          name="other"
          initialValue={0}
        >
          <InputNumber
            placeholder="Boshqa usullar bilan to'lov"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
            addonAfter={
              <Button
                disabled={totalPayment >= totalPrice}
                type="primary"
                onClick={handleAddonClick?.bind(null, 'other')}
              >
                Umumiy miqdor
              </Button>
            }
          />
        </Form.Item>
        <Form.Item
          label="To'lov haqida ma'lumot"
          name="description"
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
      <div>
        <p
          style={{
            textAlign: 'end',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
          }}
        >
          Umumiy qiymati: {priceFormat(totalPrice)}
        </p>
        <p
          style={{
            textAlign: 'end',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
          }}
        >
          Jami to&apos;lov: {priceFormat(totalPayment)}
        </p>
        <p
          style={{
            textAlign: 'end',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0,
          }}
        >
          Qarzga: {priceFormat(Number(totalPrice) - Number(totalPayment) || 0)}
        </p>
      </div>
    </Modal>
  );
});
