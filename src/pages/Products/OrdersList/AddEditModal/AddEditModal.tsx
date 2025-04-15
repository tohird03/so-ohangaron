import React, { useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Checkbox, DatePicker, Form, InputNumber, Modal, Popconfirm, Select, Spin, Tag } from 'antd';
import classNames from 'classnames';
import { addNotification } from '@/utils';
import { ordersStore, productsListStore } from '@/stores/products';
import { priceFormat } from '@/utils/priceFormat';
import { CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { clientsInfoStore, singleClientStore } from '@/stores/clients';
import { ordersApi } from '@/api/order';
import styles from '../orders.scss';
import {
  IAddOrder,
  IAddOrderModalForm,
  IAddOrderProducts,
  IOrderProductAdd,
  IOrderProducts,
} from '@/api/order/types';
import Table, { ColumnType } from 'antd/es/table';
import { OrderStatus, OrderStatusColor } from '../constants';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useParams } from 'react-router-dom';
import { IClientsInfo } from '@/api/clients';
import { getFullDateFormat } from '@/utils/getDateFormat';

const cn = classNames.bind(styles);

const filterOption = (input: string, option?: { label: string, value: string }) => {
  if (!input) return true;
  const formattedInput = input.trim().toLowerCase();
  const formattedLabel = option?.label?.toLowerCase() || '';

  return formattedLabel.includes(formattedInput);
};

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [searchClients, setSearchClients] = useState<string | null>(null);
  const [searchProducts, setSearchProducts] = useState<string | null>(null);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState<IOrderProducts | null>(null);
  const [isOpenProductSelect, setIsOpenProductSelect] = useState(false);
  const countInputRef = useRef<HTMLInputElement>(null);
  const productRef = useRef<any>(null);
  const clientRef = useRef<any>(null);
  const { clientId } = useParams();
  const changeCostRef = useRef<any>(null);
  const changeCountRef = useRef<any>(null);
  const [selectedClient, setSelectedClient] = useState<IClientsInfo | null>(null);

  // GET DATAS
  const { data: clientsData, isLoading: loadingClients } = useQuery({
    queryKey: ['getClients', searchClients],
    queryFn: () =>
      clientsInfoStore.getClients({
        pageNumber: 1,
        pageSize: 15,
        search: searchClients!,
      }),
  });

  const { data: productsData, isLoading: loadingProducts } = useQuery({
    queryKey: ['getProducts', searchProducts],
    queryFn: () =>
      productsListStore.getProducts({
        pageNumber: 1,
        pageSize: 15,
        search: searchProducts!,
      }),
  });

  const handleOpenPaymentModal = () => {
    if (ordersStore?.order?.id) {
      ordersStore.setOrderPayment({
        payment: ordersStore?.order?.payment,
        client: ordersStore?.order?.client,
        orderId: ordersStore?.order?.id,
      });
      ordersStore.setIsOpenPaymentModal(true);
    }
  };

  // SUBMIT FORMS
  const handleSaveAccepted = () => {
    setCreateLoading(true);

    ordersApi.updateOrder({
      accepted: true,
      id: ordersStore?.order?.id!,
      sendUser: ordersStore?.isSendUser,
      clientId: form.getFieldValue('clientId'),
      sum: form.getFieldValue('sum'),
    })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['getOrders'] });
        if (clientId) {
          singleClientStore.getSingleClient(clientId!);
        }
        handleModalClose();
      })
      .catch(addNotification)
      .finally(() => {
        setCreateLoading(false);
      });
  };

  const handleCreateOrUpdateOrder = () => {
    if (!form.getFieldValue('count')) {
      form.setFields([
        {
          name: 'count',
          errors: ['Mahsulot sonini kiriting!'],
        },
      ]);

      return;
    }

    form.submit();
  };

  const handleSubmitProduct = (values: IAddOrderModalForm) => {
    if (loading) {
      return;
    }

    setLoading(true);

    const addProducts: IAddOrderProducts = {
      product_id: values?.product_id,
      count: values?.count,
      price: values?.price,
    };

    if (ordersStore?.order) {
      const addOrderProduct: IOrderProductAdd = {
        ...addProducts,
        order_id: ordersStore?.order?.id,
      };

      ordersApi.updateOrder({
        id: ordersStore?.order?.id,
        clientId: values?.clientId,
        sendUser: ordersStore?.isSendUser,
        sum: values?.sum!,
      })
        .catch(addNotification);

      ordersApi.orderProductAdd(addOrderProduct)
        .then(() => {
          form.resetFields(['product_id', 'price', 'count']);
          ordersStore.getSingleOrder(ordersStore.order?.id!)
            .finally(() => {
              const fieldInstance = form.getFieldInstance('product_id');

              fieldInstance?.focus();
            });
          queryClient.invalidateQueries({ queryKey: ['getOrders'] });
        })
        .catch(addNotification)
        .finally(() => {
          setLoading(false);
          if (clientId) {
            singleClientStore.getSingleClient(clientId!);
          }
        });

      return;
    }

    const createOrderData: IAddOrder = {
      clientId: values?.clientId,
      products: [addProducts],
    };

    ordersApi.addNewOrder(createOrderData)
      .then(res => {
        form.resetFields(['product_id', 'price', 'count']);
        if (res?.id) {
          ordersStore.getSingleOrder(res?.id!)
            .finally(() => {
              const fieldInstance = form.getFieldInstance('product_id');

              fieldInstance?.focus();
            });
        } else {
          ordersStore.setOrder(res);
        }
        queryClient.invalidateQueries({ queryKey: ['getOrders'] });
      })
      .catch(addNotification)
      .finally(() => {
        setLoading(false);
        if (clientId) {
          singleClientStore.getSingleClient(clientId!);
        }
      });
  };

  const handleModalClose = () => {
    ordersStore.setSingleOrder(null);
    ordersStore.setOrder(null);
    ordersStore.setIsOpenAddEditNewOrderModal(false);
  };

  // SEARCH OPTIONS
  const handleSearchSupplier = (value: string) => {
    setSearchClients(value);
  };

  const handleSearchProducts = (value: string) => {
    setSearchProducts(value);
  };

  const handleChangeClientSelect = (client: IClientsInfo) => {
    setSelectedClient(client);
    setIsOpenProductSelect(true);
    productRef.current?.focus();
  };

  const handleFocusToProduct = () => {
    setIsOpenProductSelect(true);
  };

  const handleChangeProduct = (productId: string) => {
    const findProduct = productsData?.data?.find(product => product?.id === productId);

    form.setFieldValue('price', findProduct?.selling_price);

    setIsOpenProductSelect(false);
    countInputRef.current?.focus();
  };

  const handleClearClient = () => {
    setSearchClients(null);
  };

  const supplierOptions = useMemo(() => (
    clientsData?.data.map((supplier) => ({
      value: supplier?.id,
      label: `${supplier?.name}: +${supplier?.phone}`,
    }))
  ), [clientsData]);

  useEffect(() => {
    if (ordersStore.singleOrder && ordersStore?.order) {
      setSearchClients(ordersStore?.order?.client?.phone);
      setSelectedClient(ordersStore?.order?.client);

      form.setFieldsValue({
        cash: ordersStore.order?.payment?.cash,
        card: ordersStore.order?.payment?.card,
        transfer: ordersStore.order?.payment?.transfer,
        other: ordersStore.order?.payment?.other,
        sellingDate: dayjs(ordersStore.order?.sellingDate),
        clientId: ordersStore?.order?.client?.id,
      });

    } else if (singleClientStore.activeClient?.id) {
      setSearchClients(singleClientStore.activeClient?.phone);
      form.setFieldValue('clientId', singleClientStore.activeClient?.id);
    }
  }, [ordersStore.order, singleClientStore.activeClient]);

  const countColor = (count: number, min_amount: number): string =>
    count < 0 ? 'red' : count < min_amount ? 'orange' : 'green';

  // TABLE ACTIONS
  const handleEditProduct = (orderProduct: IOrderProducts) => {
    setIsUpdatingProduct(orderProduct);
  };

  const handleDeleteProduct = (orderId: string) => {
    ordersApi.deleteOrderProduct(orderId)
      .then(() => {
        ordersStore.getSingleOrder(ordersStore.order?.id!)
          .finally(() => {
            setLoading(false);
            if (clientId) {
              singleClientStore.getSingleClient(clientId!);
            }
          });
      })
      .catch(addNotification)
      .finally(() => {
        if (clientId) {
          singleClientStore.getSingleClient(clientId!);
        }
      });
  };

  const handleChangePrice = (value: number | null) => {
    setIsUpdatingProduct({ ...isUpdatingProduct!, price: value || 0 });
  };

  const handleChangeCount = (value: number | null) => {
    setIsUpdatingProduct({ ...isUpdatingProduct!, count: value || 0 });
  };

  const handleSaveAndUpdateOrderProduct = () => {
    if (isUpdatingProduct) {
      ordersApi.updateOrderProduct({
        id: isUpdatingProduct?.id,
        price: isUpdatingProduct?.price,
        count: isUpdatingProduct?.count,
      })
        .then(res => {
          if (res) {
            ordersStore.getSingleOrder(ordersStore.order?.id!)
              .then(() => {
                setIsUpdatingProduct(null);
              })
              .finally(() => {
                setLoading(false);
              });
            addNotification('Mahsulot muvaffaqiyatli o\'zgartildi!');
          }
          queryClient.invalidateQueries({ queryKey: ['getOrders'] });
        })
        .catch(addNotification)
        .finally(() => {
          if (clientId) {
            singleClientStore.getSingleClient(clientId!);
          }
        });
    }
  };

  const handleDoubleClickChangeProduct = (order: IOrderProducts, fieldRef: any) => {
    setIsUpdatingProduct(order);
    setTimeout(() => {
      fieldRef?.current?.focus();
    }, 0);
  };

  const addOrderProductsColumns: ColumnType<IOrderProducts>[] = [
    {
      key: 'index',
      dataIndex: 'index',
      title: '#',
      align: 'center',
      render: (value, record, index) => index + 1,
    },
    {
      key: 'product_name',
      dataIndex: 'product_name',
      title: 'Mahsulot nomi',
      align: 'center',
      render: (value, record) => record?.product?.name,
    },
    {
      key: 'count',
      dataIndex: 'count',
      title: 'Soni/Narxi/Kg',
      align: 'center',
      render: (value, record) => (
        isUpdatingProduct?.id === record?.id ? (
          <>
            <InputNumber
              defaultValue={record?.count}
              placeholder="Narxi"
              disabled={isUpdatingProduct?.id !== record?.id}
              onChange={handleChangeCount}
              ref={changeCountRef}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSaveAndUpdateOrderProduct();
                }
              }}
            />
            <span>{record?.product?.unit}</span>
          </>
        ) : <span onDoubleClick={handleDoubleClickChangeProduct?.bind(null, record, changeCountRef)}>{record?.count} {record?.product?.unit}</span>
      ),
    },
    {
      key: 'cost',
      dataIndex: 'cost',
      title: 'Narxi',
      align: 'center',
      render: (value, record) => (
        isUpdatingProduct?.id === record?.id ? (
          <InputNumber
            defaultValue={record?.price}
            placeholder="Narxi"
            disabled={isUpdatingProduct?.id !== record?.id}
            onChange={handleChangePrice}
            ref={changeCostRef}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSaveAndUpdateOrderProduct();
              }
            }}
          />
        ) : <span onDoubleClick={handleDoubleClickChangeProduct?.bind(null, record, changeCostRef)}>{record?.price}</span>
      ),
    },
    {
      key: 'totalCost',
      dataIndex: 'totalCost',
      title: 'Jami narxi',
      align: 'center',
      render: (value, record) => priceFormat(record?.price * record?.count),
    },
    {
      key: 'action',
      dataIndex: 'action',
      title: 'Action',
      align: 'center',
      render: (value, record) => (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
          {isUpdatingProduct?.id === record?.id ? (
            <Button
              onClick={handleSaveAndUpdateOrderProduct}
              type="primary"
              style={{ backgroundColor: 'green' }}
              icon={<CheckOutlined />}
            />
          ) : (
            <Button
              onClick={handleEditProduct.bind(null, record)}
              type="primary"
              icon={<EditOutlined />}
            />
          )
          }
          <Popconfirm
            title="Mahsulotni o'chirish"
            description="Rostdan ham bu mahsulotni o'chirishni xohlaysizmi?"
            onConfirm={handleDeleteProduct.bind(null, record?.id)}
            okText="Ha"
            okButtonProps={{ style: { background: 'red' } }}
            cancelText="Yo'q"
          >
            <Button type="primary" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleAddClient = () => {
    clientsInfoStore.setIsOpenAddEditClientModal(true);
  };

  const handleChaneOrderDate = (value: Dayjs | null, dateString: string) => {
    if (ordersStore?.order?.id) {
      ordersApi.updateOrder({
        id: ordersStore?.order?.id!,
        sellingDate: value?.toISOString(),
        sendUser: ordersStore?.isSendUser,
      })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['getOrders'] });
          if (clientId) {
            singleClientStore.getSingleClient(clientId!);
          }
          handleModalClose();
        })
        .catch(addNotification)
        .finally(() => {
          setCreateLoading(false);
        });
    }
  };

  const handleAddProduct = () => {
    productsListStore.setIsOpenAddEditProductModal(true);
  };

  const handleChangePriceForm = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!form.getFieldValue('price')) {
      form.setFields([
        {
          name: 'price',
          errors: ['Mahsulot narxini kiriting!'],
        },
      ]);

      return;
    }

    if (e.key === 'Enter') {
      countInputRef?.current?.focus();
    }
  };

  const handleChangeTotalPrice = (value: number | null) => {
    if (ordersStore?.order?.id) {
      ordersApi.updateOrder({
        id: ordersStore?.order?.id!,
        sum: value || 0,
      })
        .then(() => {
          ordersStore.getSingleOrder(ordersStore.order?.id!);
          queryClient.invalidateQueries({ queryKey: ['getOrders'] });
          if (clientId) {
            singleClientStore.getSingleClient(clientId!);
          }
        })
        .catch(addNotification)
        .finally(() => {
          setCreateLoading(false);
        });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      if (!form.getFieldValue('count')) {
        form.setFields([
          {
            name: 'count',
            errors: ['Mahsulot soni/kg/metrini kiriting!'],
          },
        ]);

        return;
      }

      e.preventDefault();

      const fieldsValue = form.getFieldsValue();

      const requiredFields = form
        .getFieldsError()
        .filter((field) => field.errors.length > 0);

      const firstEmptyField = requiredFields.find(
        (field) => !fieldsValue[field.name[0]]
      );

      if (firstEmptyField) {
        const fieldInstance = form.getFieldInstance(firstEmptyField.name[0]);

        fieldInstance?.focus();
      } else {
        form.submit();
      }
    }
  };

  const handleSelectChange = (value: any, name: string) => {
    const nextFieldName = getNextFieldName(name);

    if (nextFieldName) {
      const nextField = form.getFieldInstance(nextFieldName);

      nextField?.focus();
    }
  };

  const getNextFieldName = (currentFieldName: string) => {
    const fieldNames = [
      'clientId',
      'product_id',
      'price',
      'count',
    ];

    const currentIndex = fieldNames.indexOf(currentFieldName);

    return fieldNames[currentIndex + 1];
  };

  const handleBlurProduct = () => {
    setIsOpenProductSelect(false);
  };

  const rowClassName = (record: IOrderProducts) => {
    if (ordersStore?.order?.products) {
      const isDuplicate = ordersStore?.order?.products?.filter(product => product?.product?.id === record?.product?.id).length > 1;

      return isDuplicate ? 'warning__row' : '';
    }

    return '';
  };

  return (
    <Modal
      open={ordersStore.isOpenAddEditNewOrderModal}
      keyboard
      title={(
        <div className={cn('order__add-products-header')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {ordersStore?.order?.id ? 'Sotuvni tahrirlash' : 'Yangi sotuv'}
            <p style={{ margin: 0 }}>{selectedClient && `Mijoz qarzi: ${priceFormat(selectedClient?.debt)}`}</p>
            {ordersStore?.order?.id && (
              <Button
                type="primary"
                style={{ backgroundColor: 'green' }}
                onClick={handleSaveAccepted}
                loading={createLoading}
              >
                Saqlash
              </Button>
            )}
          </div>
          <div>
            <Tag
              color={OrderStatusColor[String(ordersStore?.order?.accepted || false)]}
            >
              {OrderStatus[String(ordersStore?.order?.accepted || false)]}
            </Tag>
            <Button
              type="primary"
              onClick={handleOpenPaymentModal}
            >
              Mijoz to&lsquo;lovi
            </Button>
          </div>
        </div>
      )}
      onCancel={handleModalClose}
      cancelText="Bekor qilish"
      centered
      style={{ top: 0, padding: 0 }}
      bodyStyle={{
        height: '85vh',
        overflow: 'auto',
      }}
      width="100vw"
      footer={
        <div>
          {!ordersStore?.order?.accepted && (
            <Button
              type="primary"
              style={{ backgroundColor: '#ff7700' }}
              onClick={handleModalClose}
            >
              Tasdiqlamasdan saqlash
            </Button>
          )}
        </div>
      }
    >
      {/* PRODUCTS FORM */}
      <Form
        form={form}
        onFinish={handleSubmitProduct}
        layout="vertical"
        autoComplete="off"
        className="order__add-products-form"
        onKeyPress={handleKeyPress}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Item
            label="Mijoz"
            rules={[{ required: true }]}
            name="clientId"
            style={{ flex: 1, width: '100%' }}
            help={selectedClient?.lastSale ? `Oxirgi sotuv: ${getFullDateFormat(selectedClient?.lastSale)}` : ''}
          >
            <Select
              showSearch
              ref={clientRef}
              placeholder="Mijoz"
              loading={loadingClients}
              optionFilterProp="children"
              notFoundContent={loadingClients ? <Spin style={{ margin: '10px' }} /> : null}
              filterOption={filterOption}
              onSearch={handleSearchSupplier}
              onClear={handleClearClient}
              options={supplierOptions}
              onChange={(value) => {
                const client = clientsData?.data.find((client) => client.id === value);

                if (client) {
                  handleChangeClientSelect(client);
                }
              }}
              onSelect={(value) => handleSelectChange(value, 'clientId')}
              allowClear
              style={{ flex: 1, width: '100%' }}
            />
          </Form.Item>
          <Button style={{ marginTop: '5px' }} onClick={handleAddClient} icon={<PlusOutlined />} />
        </div>
        <Form.Item
          label="Sotish sanasi"
          name="sellingDate"
          initialValue={dayjs()}
        >
          <DatePicker
            defaultValue={dayjs()}
            format="DD.MM.YYYY"
            style={{ width: '100%' }}
            onChange={handleChaneOrderDate}
          />
        </Form.Item>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Item
            label="Mahsulot"
            rules={[{ required: true }]}
            name="product_id"
            style={{ flex: 1, width: '100%' }}
          >
            <Select
              showSearch
              placeholder="Mahsulot"
              loading={loadingProducts}
              optionFilterProp="children"
              notFoundContent={loadingProducts ? <Spin style={{ margin: '10px' }} /> : null}
              filterOption={false}
              onSearch={handleSearchProducts}
              onChange={handleChangeProduct}
              optionLabelProp="label"
              open={isOpenProductSelect}
              onFocus={handleFocusToProduct}
              ref={productRef}
              onBlur={handleBlurProduct}
            >
              {productsData?.data.map((product) => (
                <Select.Option
                  key={product?.id}
                  value={product?.id}
                  label={product?.name}
                  className={cn('income-order__add-product')}
                >
                  <div className={cn('income-order__add-product-option')}>
                    <p className={cn('income-order__add-product-name')}>
                      {product?.name}
                    </p>
                    <div className={cn('income-order__add-product-info')}>
                      <p className={cn('income-order__add-product-price')}>
                        {product?.selling_price}
                      </p>
                      <p
                        style={{ backgroundColor: `${countColor(product?.count, product?.min_amount)}` }}
                        className={cn('income-order__add-product-count')}
                      >
                        {product?.count} dona
                      </p>
                    </div>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button style={{ marginTop: '5px' }} onClick={handleAddProduct} icon={<PlusOutlined />} />
        </div>
        <Form.Item
          label="Narxi"
          rules={[{ required: true }]}
          name="price"
          initialValue={0}
        >
          <InputNumber
            placeholder="Narxi"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
            onKeyUp={handleChangePriceForm}
          />
        </Form.Item>
        <Form.Item
          label="Mahsulot soni/metr/kg"
          rules={[{ required: true }]}
          name="count"
        >
          <InputNumber
            placeholder="Mahsulot sonini kiriting"
            style={{ width: '100%' }}
            ref={countInputRef}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Button
          onClick={handleCreateOrUpdateOrder}
          type="primary"
          icon={<PlusOutlined />}
          loading={loading}
        >
          Qo&apos;shish
        </Button>
      </Form>

      {/* PRODUCTS SHOW LIST */}
      <Table
        columns={addOrderProductsColumns}
        dataSource={ordersStore?.order?.products || []}
        pagination={false}
        scroll={{ y: 350 }}
        rowClassName={rowClassName}
      />

      <div>
        <p style={{ textAlign: 'end', fontSize: '24px', fontWeight: 'bold' }}>Umumiy qiymati: {priceFormat(ordersStore?.order?.sum)}
        </p>
      </div>
    </Modal>
  );
});
