import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Button, Input, Table, Typography } from 'antd';
import classNames from 'classnames';
import { DataTable } from '@/components/Datatable/datatable';
import { getPaginationParams } from '@/utils/getPaginationParams';
import { useMediaQuery } from '@/utils/mediaQuery';
import { AddEditModal } from './AddEditModal';
import styles from './product-list.scss';
import { productsListColumn } from './constants';
import { productsListStore } from '@/stores/products';
import { IProducts } from '@/api/product/types';
import { priceFormat } from '@/utils/priceFormat';
import { authStore } from '@/stores/auth';

const cn = classNames.bind(styles);

export const ProductsList = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const { data: productsData, isLoading: loading } = useQuery({
    queryKey: [
      'getProducts',
      productsListStore.pageNumber,
      productsListStore.pageSize,
      productsListStore.search,
    ],
    queryFn: () =>
      productsListStore.getProducts({
        pageNumber: productsListStore.pageNumber,
        pageSize: productsListStore.pageSize,
        search: productsListStore.search!,
      }),
  });

  const handleAddNewProduct = () => {
    productsListStore.setIsOpenAddEditProductModal(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    productsListStore.setSearch(e.currentTarget?.value);
  };

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    productsListStore.setPageNumber(page);
    productsListStore.setPageSize(pageSize!);
  };

  useEffect(() => () => {
    productsListStore.reset();
  }, []);

  const rowClassName = (record: IProducts) =>
    record.count < 0 ? 'error__row'
      : record.count < record?.min_amount
        ? 'warning__row' : '';

  return (
    <main>
      <div className={cn('product-list__head')}>
        <Typography.Title level={3}>Mahsulotlar</Typography.Title>
        <div className={cn('product-list__filter')}>
          <Input
            placeholder="Mahsulotni qidirish"
            allowClear
            onChange={handleSearch}
            className={cn('product-list__search')}
          />
          <Button
            onClick={handleAddNewProduct}
            type="primary"
            icon={<PlusCircleOutlined />}
          >
            Mahsulot qo&apos;shish
          </Button>
        </div>
      </div>

      <Table
        columns={productsListColumn}
        dataSource={productsData?.data || []}
        loading={loading}
        rowClassName={rowClassName}
        pagination={{
          total: productsData?.totalCount,
          current: productsListStore?.pageNumber,
          pageSize: productsListStore?.pageSize,
          showSizeChanger: true,
          onChange: handlePageChange,
          ...getPaginationParams(productsData?.totalCount),
          pageSizeOptions: [50, 100, 500, 1000],
        }}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={2} index={1} />
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                Umumiy:
                <p style={{ margin: '0', fontWeight: 'bold' }}>{productsData?.totalCalc?.totalProductCount}</p>
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <div style={{ textAlign: 'center', fontWeight: 'bold', maxWidth: '150px', margin: '0 auto' }}>
                Umumiy sotib olingan narxi:
                <p style={{ margin: '0', fontWeight: 'bold' }}>{priceFormat(productsData?.totalCalc?.totalProductCost)}</p>
              </div>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3}>
              <div style={{ textAlign: 'center', fontWeight: 'bold', maxWidth: '150px', margin: '0 auto' }}>
                Umumiy sotilish narxi:
                <p style={{ margin: '0', fontWeight: 'bold' }}>{priceFormat(productsData?.totalCalc?.totalProductPrice)}</p>
              </div>
            </Table.Summary.Cell>
            {authStore?.staffInfo?.role === 'super_admin' && (
              <Table.Summary.Cell index={3}>
                <div style={{ textAlign: 'center', fontWeight: 'bold', maxWidth: '150px', margin: '0 auto' }}>
                  Umumiy qiymati:
                  <p style={{ margin: '0', fontWeight: 'bold' }}>
                    {priceFormat(productsData?.data?.reduce((cur, prev) => cur + prev?.cost * prev?.count, 0))}
                  </p>
                </div>
              </Table.Summary.Cell>
            )
            }
          </Table.Summary.Row>
        )}
      />


      {productsListStore.isOpenAddEditProductModal && <AddEditModal />}
    </main>
  );
});
