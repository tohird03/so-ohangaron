import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, DatePickerProps, Input, Typography } from 'antd';
import classNames from 'classnames';
import { DataTable } from '@/components/Datatable/datatable';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { useMediaQuery } from '@/utils/mediaQuery';
import { AddEditModal } from './AddEditModal';
import styles from './payments.scss';
import { paymentsColumns } from './constants';
import { supplierPaymentsStore } from '@/stores/supplier';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const cn = classNames.bind(styles);

export const SupplierPayments = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const { supplierId } = useParams();

  const { data: clientsInfoData, isLoading: loading } = useQuery({
    queryKey: [
      'getPayments',
      supplierPaymentsStore.pageNumber,
      supplierPaymentsStore.pageSize,
      supplierPaymentsStore.search,
      supplierPaymentsStore.startDate,
      supplierPaymentsStore.endDate,
      supplierId,
    ],
    queryFn: () =>
      supplierPaymentsStore.getSupplierPayments({
        pageNumber: supplierPaymentsStore.pageNumber,
        pageSize: supplierPaymentsStore.pageSize,
        search: supplierPaymentsStore.search!,
        startDate: supplierPaymentsStore?.startDate!,
        endDate: supplierPaymentsStore?.endDate!,
        supplierId,
      }),
  });

  const handleAddNewPayment = () => {
    supplierPaymentsStore.setIsOpenAddEditPaymentModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    supplierPaymentsStore.setSearch(e.currentTarget?.value);
  };


  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      supplierPaymentsStore.setStartDate(null);
    }
    supplierPaymentsStore.setStartDate(new Date(dateString));
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      supplierPaymentsStore.setEndDate(null);
    }
    supplierPaymentsStore.setEndDate(new Date(dateString));
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    supplierPaymentsStore.setPageNumber(page);
    supplierPaymentsStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    supplierPaymentsStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('clients-payments__head')}>
        <Typography.Title level={3}>To&apos;langan qarzlar ro&apos;yxati</Typography.Title>
        <div className={cn('clients-payments__filter')}>
          <Input
            placeholder="Mijozlarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('clients-payments__search')}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleStartDateChange}
            placeholder={'Boshlanish sanasi'}
            defaultValue={dayjs(supplierPaymentsStore.startDate)}
            allowClear={false}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleEndDateChange}
            placeholder={'Tugash sanasi'}
            defaultValue={dayjs(supplierPaymentsStore.endDate)}
            allowClear={false}
          />
          <Button
            onClick={handleAddNewPayment}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Yangi to&apos;lov
          </Button>
        </div>
      </div>

      <DataTable
        columns={paymentsColumns}
        data={clientsInfoData?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: clientsInfoData?.totalCount,
          current: supplierPaymentsStore?.pageNumber,
          pageSize: supplierPaymentsStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(clientsInfoData?.totalCount),
        }}
      />

      {supplierPaymentsStore.isOpenAddEditPaymentModal && <AddEditModal />}
    </main>
  );
});
