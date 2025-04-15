import React, { useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, DatePickerProps, Input, Select, Typography } from 'antd';
import classNames from 'classnames';
import { DataTable } from '@/components/Datatable/datatable';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { useMediaQuery } from '@/utils/mediaQuery';
import { AddEditModal } from './AddEditModal';
import styles from './expenses.scss';
import { expensesColumns } from './constants';
import dayjs from 'dayjs';
import { expensesStore } from '@/stores/workers';

const cn = classNames.bind(styles);

export const Expenses = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const { data: expensesData, isLoading: loading } = useQuery({
    queryKey: [
      'getExpenses',
      expensesStore.pageNumber,
      expensesStore.pageSize,
      expensesStore.startDate,
      expensesStore.endDate,
      expensesStore.search,
    ],
    queryFn: () =>
      expensesStore.getExpenses({
        pageNumber: expensesStore.pageNumber,
        pageSize: expensesStore.pageSize,
        startDate: expensesStore.startDate!,
        endDate: expensesStore.endDate!,
        search: expensesStore.search!,
      }),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    expensesStore.setSearch(e.currentTarget?.value);
  };

  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      expensesStore.setStartDate(null);
    }
    expensesStore.setStartDate(new Date(dateString));
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      expensesStore.setEndDate(null);
    }
    expensesStore.setEndDate(new Date(dateString));
  };

  const handleAddNewClient = () => {
    expensesStore.setIsOpenAddEditExpensesModal(true);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    expensesStore.setPageNumber(page);
    expensesStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    expensesStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('client-info__head')}>
        <Typography.Title level={3}>Harajatlar hisoboti</Typography.Title>
        <div className={cn('client-info__filter')}>
          <Input
            placeholder="Harajatlarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('staffs__search')}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleStartDateChange}
            placeholder={'Boshlanish sanasi'}
            defaultValue={dayjs(expensesStore.startDate)}
            allowClear={false}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleEndDateChange}
            placeholder={'Tugash sanasi'}
            defaultValue={dayjs(expensesStore.endDate)}
            allowClear={false}
          />
          <Button
            onClick={handleAddNewClient}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Harajat qo&apos;shish
          </Button>
        </div>
      </div>

      <DataTable
        columns={expensesColumns}
        data={expensesData?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: expensesData?.totalCount,
          current: expensesStore?.pageNumber,
          pageSize: expensesStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(expensesData?.totalCount),
        }}
      />

      {expensesStore.isOpenAddEditExpensesModal && <AddEditModal />}
    </main>
  );
});
