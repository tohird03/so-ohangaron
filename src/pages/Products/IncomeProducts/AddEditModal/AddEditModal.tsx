import React, { useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, DatePicker, Form, InputNumber, Modal, Popconfirm, Select, Spin } from 'antd';
import classNames from 'classnames';
import { addNotification } from '@/utils';
import { incomeProductsStore, productsListStore } from '@/stores/products';
import { priceFormat } from '@/utils/priceFormat';
import { CheckOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/Datatable/datatable';
import { useMediaQuery } from '@/utils/mediaQuery';
import dayjs from 'dayjs';
import styles from '../income-products.scss';
import { ColumnType } from 'antd/es/table';
import { incomeProductsApi } from '@/api/income-products';
import { IAddEditIncomeOrder, IAddIncomeOrderForm, IAddIncomeOrderProducts, IIncomeOrderProductAdd, IIncomeProduct } from '@/api/income-products/types';
import { singleSupplierStore, supplierInfoStore } from '@/stores/supplier';
import { ISupplierInfo } from '@/api/clients';

const cn = classNames.bind(styles);

const filterOption = (input: string, option?: { label: string, value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const countColor = (count: number, min_amount: number): string =>
  count < 0 ? 'red' : count < min_amount ? 'orange' : 'green';

const getNextFieldName = (currentFieldName: string) => {
  const fieldNames = [
    'supplierId',
    'product_id',
    'price',
    'count',
  ];

  const currentIndex = fieldNames.indexOf(currentFieldName);

  return fieldNames[currentIndex + 1];
};

export const AddEditModal = observer(() => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 800px)');
  const [loading, setLoading] = useState(false);
  const [searchClients, setSearchClients] = useState<string | null>(null);
  const [searchProducts, setSearchProducts] = useState<string | null>(null);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState<IIncomeProduct | null>(null);
  const [isOpenProductSelect, setIsOpenProductSelect] = useState(false);
  const countInputRef = useRef<HTMLInputElement>(null);
  const productRef = useRef<any>(null);
  const clientRef = useRef<any>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<ISupplierInfo | null>(null);

  // GET DATAS
  const { data: supplierData, isLoading: loadingClients } = useQuery({
    queryKey: ['getSuppliers', searchClients],
    queryFn: () =>
      supplierInfoStore.getSuppliers({
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
    if (incomeProductsStore?.incomeOrder?.id) {
      incomeProductsStore.setIncomeOrderPayment({
        payment: incomeProductsStore?.incomeOrder?.payment,
        supplier: incomeProductsStore?.incomeOrder?.supplier,
        orderId: incomeProductsStore?.incomeOrder?.id,
      });
      incomeProductsStore.setIsOpenIncomePaymentModal(true);
    }
  };

  // SUBMIT FORMS
  const handleSaveAccepted = () => {
    incomeProductsApi.updateIncomeOrder({
      id: incomeProductsStore?.incomeOrder?.id!,
    })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['getIncomeOrders'] });
        handleModalClose();
      })
      .catch(addNotification);
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

  const handleSubmitProduct = (values: IAddIncomeOrderForm) => {
    setLoading(true);

    const addProducts: IAddIncomeOrderProducts = {
      product_id: values?.product_id,
      count: values?.count,
      cost: values?.cost,
      selling_price: values?.selling_price,
    };

    if (incomeProductsStore?.incomeOrder) {
      const addOrderProduct: IIncomeOrderProductAdd = {
        ...addProducts,
        incomingOrderId: incomeProductsStore?.incomeOrder?.id,
      };

      incomeProductsApi.orderProductAdd(addOrderProduct)
        .then(() => {
          form.resetFields(['product_id', 'cost', 'count', 'selling_price']);
          incomeProductsStore.getSingleIncomeOrder(incomeProductsStore?.incomeOrder?.id!)
            .finally(() => {
              const fieldInstance = form.getFieldInstance('product_id');

              fieldInstance?.focus();
            });
          queryClient.invalidateQueries({ queryKey: ['getIncomeOrders'] });
        })
        .catch(addNotification)
        .finally(() => {
          setLoading(false);
        });

      return;
    }

    const createOrderData: IAddEditIncomeOrder = {
      supplierId: values?.supplierId,
      sellingDate: values?.sellingDate,
      products: [addProducts],
    };

    incomeProductsApi.addNewIncomeOrder(createOrderData)
      .then(res => {
        form.resetFields(['product_id', 'cost', 'count', 'selling_price']);
        if (res?.id) {
          incomeProductsStore.getSingleIncomeOrder(res?.id!)
            .finally(() => {
              const fieldInstance = form.getFieldInstance('product_id');

              fieldInstance?.focus();
            });
        } else {
          incomeProductsStore.setIncomeOrder(res);
        }
        queryClient.invalidateQueries({ queryKey: ['getIncomeOrders'] });
      })
      .catch(addNotification)
      .finally(() => {
        setLoading(false);
      });
  };

  const handleModalClose = () => {
    incomeProductsStore.setsingleIncomeOrder(null);
    incomeProductsStore.setIncomeOrder(null);
    incomeProductsStore.setIsOpenAddEditIncomeProductsModal(false);
  };

  // SEARCH OPTIONS
  const handleSearchSupplier = (value: string) => {
    setSearchClients(value);
  };

  const handleSearchProducts = (value: string) => {
    setSearchProducts(value);
  };

  const handleChangeProduct = (productId: string) => {
    const findProduct = productsData?.data?.find(product => product?.id === productId);

    form.setFieldValue('cost', findProduct?.cost);
    form.setFieldValue('selling_price', findProduct?.selling_price);

    setIsOpenProductSelect(false);
    countInputRef.current?.focus();
  };

  const handleClearClient = () => {
    setSearchClients(null);
  };

  const supplierOptions = useMemo(() => (
    supplierData?.data.map((supplier) => ({
      value: supplier?.id,
      label: `${supplier?.name}: +${supplier?.phone}`,
    }))
  ), [supplierData]);

  useEffect(() => {
    if (incomeProductsStore.singleIncomeOrder && incomeProductsStore?.incomeOrder) {
      setSearchClients(incomeProductsStore?.incomeOrder?.supplier?.phone!);
      setSelectedSupplier(incomeProductsStore?.incomeOrder?.supplier);

      form.setFieldsValue({
        cash: incomeProductsStore.incomeOrder?.payment?.cash,
        card: incomeProductsStore.incomeOrder?.payment?.card,
        transfer: incomeProductsStore.incomeOrder?.payment?.transfer,
        other: incomeProductsStore.incomeOrder?.payment?.other,
        sellingDate: dayjs(incomeProductsStore.incomeOrder?.sellingDate),
        supplierId: incomeProductsStore?.incomeOrder?.supplier?.id,
      });
    } else if (singleSupplierStore.activeClient?.id) {
      setSearchClients(singleSupplierStore.activeClient?.phone);
      form.setFieldValue('supplierId', singleSupplierStore.activeClient?.id);
    }
  }, [incomeProductsStore.incomeOrder, singleSupplierStore.activeClient]);

  // TABLE ACTIONS
  const handleEditProduct = (orderProduct: IIncomeProduct) => {
    setIsUpdatingProduct(orderProduct);
  };

  const handleDeleteProduct = (orderId: string) => {
    incomeProductsApi.deleteOrderProduct(orderId)
      .then(() => {
        incomeProductsStore.getSingleIncomeOrder(incomeProductsStore.incomeOrder?.id!)
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(addNotification);
  };

  const handleChangePrice = (value: number | null) => {
    setIsUpdatingProduct({ ...isUpdatingProduct!, cost: value || 0 });
  };

  const handleChangeCount = (value: number | null) => {
    setIsUpdatingProduct({ ...isUpdatingProduct!, count: value || 0 });
  };

  const handleChangeSellingPrice = (value: number | null) => {
    setIsUpdatingProduct({ ...isUpdatingProduct!, selling_price: value || 0 });
  };

  const handleSaveAndUpdateOrderProduct = () => {
    if (isUpdatingProduct) {
      incomeProductsApi.updateOrderProduct({
        id: isUpdatingProduct?.id,
        cost: isUpdatingProduct?.cost,
        count: isUpdatingProduct?.count,
        selling_price: isUpdatingProduct?.selling_price,
      })
        .then(res => {
          if (res) {
            incomeProductsStore.getSingleIncomeOrder(incomeProductsStore.incomeOrder?.id!)
              .then(() => {
                setIsUpdatingProduct(null);
              })
              .finally(() => {
                setLoading(false);
              });
            addNotification('Mahsulot muvaffaqiyatli o\'zgartildi!');
          }
        })
        .catch(addNotification);
    }
  };

  const addOrderProductsColumns: ColumnType<IIncomeProduct>[] = [
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
      title: 'Soni',
      align: 'center',
      render: (value, record) => (
        isUpdatingProduct?.id === record?.id ? (
          <InputNumber
            defaultValue={record?.count}
            placeholder="Soni"
            disabled={isUpdatingProduct?.id !== record?.id}
            onChange={handleChangeCount}
          />
        ) : <span>{record?.count} {record?.product?.unit}</span>
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
            defaultValue={record?.cost}
            placeholder="Narxi"
            disabled={isUpdatingProduct?.id !== record?.id}
            onChange={handleChangePrice}
          />
        ) : <span>{record?.cost}</span>
      ),
    },
    {
      key: 'cost',
      dataIndex: 'cost',
      title: 'Sotish narxi',
      align: 'center',
      render: (value, record) => (
        isUpdatingProduct?.id === record?.id ? (
          <InputNumber
            defaultValue={record?.selling_price}
            placeholder="Sotish narxi"
            disabled={isUpdatingProduct?.id !== record?.id}
            onChange={handleChangeSellingPrice}
          />
        ) : <span>{record?.selling_price}</span>
      ),
    },
    {
      key: 'totalCost',
      dataIndex: 'totalCost',
      title: 'Jami narxi',
      align: 'center',
      render: (value, record) => record?.cost * record?.count,
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (!form.getFieldValue('count')) {
      form.setFields([
        {
          name: 'count',
          errors: ['Mahsulot sonini kiriting!'],
        },
      ]);

      return;
    }

    if (e.key === 'Enter') {
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

  const handleBlurProduct = () => {
    setIsOpenProductSelect(false);
  };

  const handleChangeCostForm = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!form.getFieldValue('cost')) {
      form.setFields([
        {
          name: 'cost',
          errors: ['Mahsulot sotib olingan narxini kiriting!'],
        },
      ]);

      return;
    }

    if (e.key === 'Enter') {
      countInputRef?.current?.focus();
    }
  };

  const handleChangePriceForm = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!form.getFieldValue('selling_price')) {
      form.setFields([
        {
          name: 'selling_price',
          errors: ['Mahsulot sotiladigan narxini kiriting!'],
        },
      ]);

      return;
    }

    if (e.key === 'Enter') {
      countInputRef?.current?.focus();
    }
  };

  const handleChangeClientSelect = (supplier: ISupplierInfo) => {
    setSelectedSupplier(supplier);
    setIsOpenProductSelect(true);
    productRef.current?.focus();
  };

  const handleFocusToProduct = () => {
    setIsOpenProductSelect(true);
  };

  const rowClassName = (record: IIncomeProduct) => {
    if (incomeProductsStore?.incomeOrder?.incomingProducts) {
      const isDuplicate = incomeProductsStore?.incomeOrder?.incomingProducts?.filter(product => product?.product?.id === record?.product?.id).length > 1;

      return isDuplicate ? 'warning__row' : '';
    }

    return '';
  };

  return (
    <Modal
      open={incomeProductsStore.isOpenAddEditIncomeProductsModal}
      title={(
        <div className={cn('order__add-products-header')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {
              incomeProductsStore?.incomeOrder?.id
                ? 'Tushurilgan mahsulotlarni tahrirlash'
                : 'Yangi mahsulot tushurish sotuv'
            }
            <p style={{ margin: 0 }}>{selectedSupplier && `Yetkazib beruvchiga qarz: ${priceFormat(selectedSupplier?.debt)}`}</p>
            {incomeProductsStore?.incomeOrder?.id && (
              <Button
                type="primary"
                style={{ backgroundColor: 'green' }}
                onClick={handleSaveAccepted}
              >
                To&lsquo;lovsiz saqlash
              </Button>
            )}
          </div>
          <div>
            <Button
              type="primary"
              onClick={handleOpenPaymentModal}
            >
              Yetkazib beruvchiga to&lsquo;lov
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
    >
      <Form
        form={form}
        onFinish={handleSubmitProduct}
        layout="vertical"
        autoComplete="off"
        className="order__add-products-form"
        onKeyPress={handleKeyPress}
      >
        <Form.Item
          label="Yetkazib beruvchi"
          rules={[{ required: true }]}
          name="supplierId"
        >
          <Select
            showSearch
            ref={clientRef}
            placeholder="Yetkazib beruvchi"
            loading={loadingClients}
            optionFilterProp="children"
            notFoundContent={loadingClients ? <Spin style={{ margin: '10px' }} /> : null}
            filterOption={filterOption}
            onSearch={handleSearchSupplier}
            onClear={handleClearClient}
            options={supplierOptions}
            allowClear
            onChange={(value) => {
              const client = supplierData?.data?.find((client) => client.id === value);

              if (client) {
                handleChangeClientSelect(client);
              }
            }}
            onSelect={(value) => handleSelectChange(value, 'supplierId')}
          />
        </Form.Item>
        <Form.Item
          label="Sanasi"
          rules={[{ required: true }]}
          name="sellingDate"
          initialValue={dayjs()}
        >
          <DatePicker
            defaultValue={dayjs()}
            format="DD.MM.YYYY"
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label="Mahsulot"
          rules={[{ required: true }]}
          name="product_id"
        >
          <Select
            showSearch
            placeholder="Mahsulot"
            loading={loadingProducts}
            optionFilterProp="children"
            notFoundContent={loadingProducts ? <Spin style={{ margin: '10px' }} /> : null}
            filterOption={filterOption}
            onSearch={handleSearchProducts}
            open={isOpenProductSelect}
            onChange={handleChangeProduct}
            optionLabelProp="label"
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
        <Form.Item
          label="Sotib olish narxi"
          rules={[{ required: true }]}
          name="cost"
          initialValue={0}
        >
          <InputNumber
            placeholder="Sotib olingan narxi"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
            onKeyUp={handleChangeCostForm}
          />
        </Form.Item>
        <Form.Item
          label="Mahsulot soni/metr/kg"
          rules={[{ required: true }]}
          name="count"
        >
          <InputNumber
            placeholder="Tushuriladigan mahsulot sonini kiriting"
            style={{ width: '100%' }}
            ref={countInputRef}
            formatter={(value) => priceFormat(value!)}
          />
        </Form.Item>
        <Form.Item
          label="Sotish narxi"
          rules={[{ required: true }]}
          name="selling_price"
          initialValue={0}
        >
          <InputNumber
            placeholder="Sotib olingan narxi"
            style={{ width: '100%' }}
            formatter={(value) => priceFormat(value!)}
            onKeyUp={handleChangePriceForm}
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

      <DataTable
        columns={addOrderProductsColumns}
        data={incomeProductsStore?.incomeOrder?.incomingProducts || []}
        isMobile={isMobile}
        pagination={false}
        scroll={{ y: 300 }}
        rowClassName={rowClassName}
      />

      <div>
        <p style={{ textAlign: 'end', fontSize: '24px', fontWeight: 'bold' }}>Umumiy qiymati: {
          priceFormat(incomeProductsStore?.incomeOrder?.incomingProducts?.reduce((prev, current) => prev + (current?.cost * current?.count), 0))
        }
        </p>
      </div>
    </Modal>
  );
});
