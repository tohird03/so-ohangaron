import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, InputNumber, Select, Typography } from 'antd';
import classNames from 'classnames';
import { DataTable } from '@/components/Datatable/datatable';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { useMediaQuery } from '@/utils/mediaQuery';
import { AddEditModal } from './AddEditModal';
import styles from './supplier-info.scss';
import { supplierColumns, supplierDebtFilter } from './constants';
import { supplierInfoStore } from '@/stores/supplier';
import { IClientDebtFilter, ISupplierInfo } from '@/api/clients';

const cn = classNames.bind(styles);

export const SupplierInfo = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const { data: supplierData, isLoading: loading } = useQuery({
    queryKey: [
      'getSuppliers',
      supplierInfoStore.pageNumber,
      supplierInfoStore.pageSize,
      supplierInfoStore.search,
      supplierInfoStore.debt,
      supplierInfoStore.debtType,
    ],
    queryFn: () =>
      supplierInfoStore.getSuppliers({
        pageNumber: supplierInfoStore.pageNumber,
        pageSize: supplierInfoStore.pageSize,
        search: supplierInfoStore.search!,
        debt: supplierInfoStore.debt!,
        debtType: supplierInfoStore.debtType!,
      }),
  });

  const handleAddNewSupplier = () => {
    supplierInfoStore.setIsOpenAddEditSupplierModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    supplierInfoStore.setSearch(e.currentTarget?.value);
  };

  const handleDebtValueChange = (value: number | null) => {
    supplierInfoStore.setDebt(value);
  };

  const handleDebtFilterChange = (value: IClientDebtFilter) => {
    supplierInfoStore.setDebtType(value);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    supplierInfoStore.setPageNumber(page);
    supplierInfoStore.setPageSize(pageSize!);
  };

  const rowClassName = (record: ISupplierInfo) =>
    record.debt > 0 ? 'info__row'
      : record.debt < 0
        ? 'error__row' : '';

  useEffect(() => () => {
    supplierInfoStore.reset();
  }, []);

  return (
    <main>
      <div className={cn('supplier-info__head')}>
        <Typography.Title level={3}>Yetkazib beruvchilar ro&apos;yxati</Typography.Title>
        <div className={cn('supplier-info__filter')}>
          <Input
            placeholder="Yetkazib beruvchilarni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('supplier-info__search')}
          />
          <InputNumber
            placeholder="Qarz miqdorini kiriting"
            onChange={handleDebtValueChange}
            style={{ width: '350px' }}
            defaultValue={0}
            addonAfter={
              <Select
                options={supplierDebtFilter}
                onChange={handleDebtFilterChange}
                style={{ width: '200px' }}
                placeholder="Hammasi"
                value={supplierInfoStore.debtType}
              />
            }
          />
          <Button
            onClick={handleAddNewSupplier}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Yetkazib beruvchi qo&apos;shish
          </Button>
        </div>
      </div>

      <DataTable
        columns={supplierColumns}
        data={supplierData?.data || []}
        loading={loading}
        isMobile={isMobile}
        pagination={{
          total: supplierData?.totalCount,
          current: supplierInfoStore?.pageNumber,
          pageSize: supplierInfoStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(supplierData?.totalCount),
        }}
        rowClassName={rowClassName}
      />

      {supplierInfoStore.isOpenAddEditSupplierModal && <AddEditModal />}
    </main>
  );
});
