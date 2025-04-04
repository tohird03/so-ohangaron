import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { DownloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, DatePickerProps, Input, Select, Table, Tooltip, Typography } from 'antd';
import classNames from 'classnames';
import { DataTable } from '@/components/Datatable/datatable';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { useMediaQuery } from '@/utils/mediaQuery';
import { AddEditModal } from './AddEditModal';
import styles from './payments.scss';
import { paymentsColumns } from './constants';
import { paymentsStore } from '@/stores/clients';
import dayjs from 'dayjs';
import { paymentApi } from '@/api/payment';
import { addNotification } from '@/utils';
import { staffsApi } from '@/api/staffs';
import { priceFormat } from '@/utils/priceFormat';

const cn = classNames.bind(styles);

export const ClientsPayments = observer(() => {
  const [downloadLoading, setDownLoadLoading] = useState(false);

  const { data: paymentsData, isLoading: loading } = useQuery({
    queryKey: [
      'getPayments',
      paymentsStore.pageNumber,
      paymentsStore.pageSize,
      paymentsStore.search,
      paymentsStore.startDate,
      paymentsStore.endDate,
      paymentsStore.sellerId,
    ],
    queryFn: () =>
      paymentsStore.getClientsPayments({
        pageNumber: paymentsStore.pageNumber,
        pageSize: paymentsStore.pageSize,
        search: paymentsStore.search!,
        startDate: paymentsStore?.startDate!,
        endDate: paymentsStore?.endDate!,
        sellerId: paymentsStore.sellerId!,
      }),
  });

  const { data: sellerData, isLoading: loadingSeller } = useQuery({
    queryKey: ['getSellers'],
    queryFn: () =>
      staffsApi.getStaffs({
        pageNumber: 1,
        pageSize: 100,
      }),
  });

  const handleAddNewPayment = () => {
    paymentsStore.setIsOpenAddEditPaymentModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    paymentsStore.setSearch(e.currentTarget?.value);
  };

  const handleChangeSeller = (value: string) => {
    if (value) {
      paymentsStore.setSellerId(value);

      return;
    }

    paymentsStore.setSellerId(null);
  };

  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      paymentsStore.setStartDate(null);
    }
    paymentsStore.setStartDate(new Date(dateString));
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      paymentsStore.setEndDate(null);
    }
    paymentsStore.setEndDate(new Date(dateString));
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    paymentsStore.setPageNumber(page);
    paymentsStore.setPageSize(pageSize!);
  };

  const handleDownloadExcel = () => {
    setDownLoadLoading(true);
    paymentApi.getUploadPayments({
      pageNumber: paymentsStore.pageNumber,
      pageSize: paymentsStore.pageSize,
      search: paymentsStore.search!,
      startDate: paymentsStore.startDate!,
      endDate: paymentsStore.endDate!,
      sellerId: paymentsStore.sellerId!,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = 'to\'lovlar.xlsx';
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoading(false);
      });
  };

  const sellerOptions = useMemo(() => (
    sellerData?.data.map((sellerData) => ({
      value: sellerData?.id,
      label: `${sellerData?.name}`,
    }))
  ), [sellerData]);

  useEffect(() => () => {
    paymentsStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('clients-payments__head')}>
        <Typography.Title level={3}>To&apos;lovlar ro&apos;yxati</Typography.Title>
        <div className={cn('clients-payments__filter')}>
          <Input
            placeholder="Mijozlarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('clients-payments__search')}
          />
          <Select
            options={sellerOptions}
            onChange={handleChangeSeller}
            style={{ width: '200px' }}
            placeholder="Sotuvchilar"
            loading={loadingSeller}
            allowClear
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleStartDateChange}
            placeholder={'Boshlanish sanasi'}
            defaultValue={dayjs(paymentsStore.startDate)}
            allowClear={false}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleEndDateChange}
            placeholder={'Tugash sanasi'}
            defaultValue={dayjs(paymentsStore.endDate)}
            allowClear={false}
          />
          <Button
            onClick={handleAddNewPayment}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Mijoz to&apos;lovi
          </Button>
          <Tooltip placement="top" title="Excelda yuklash">
            <Button
              onClick={handleDownloadExcel}
              type="primary"
              icon={<DownloadOutlined />}
              loading={downloadLoading}
            >
              Exelda Yuklash
            </Button>
          </Tooltip>
        </div>
      </div>

      <Table
        columns={paymentsColumns}
        dataSource={paymentsData?.data || []}
        loading={loading}
        pagination={{
          total: paymentsData?.totalCount,
          current: paymentsStore?.pageNumber,
          pageSize: paymentsStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(paymentsData?.totalCount),
        }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={2} index={1} />
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Jami: {priceFormat(paymentsData?.totalCalc?.totalCash)}
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Jami: {priceFormat(paymentsData?.totalCalc?.totalCard)}
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Jami: {priceFormat(paymentsData?.totalCalc?.totalTransfer)}
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Jami: {priceFormat(paymentsData?.totalCalc?.totalOther)}
              </div>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      {paymentsStore.isOpenAddEditPaymentModal && <AddEditModal />}
    </main>
  );
});
