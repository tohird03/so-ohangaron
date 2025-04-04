import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useQuery } from '@tanstack/react-query';
import { Button, DatePicker, DatePickerProps, Table, Typography } from 'antd';
import classNames from 'classnames';
import { useMediaQuery } from '@/utils/mediaQuery';
import { deedColumns } from './constants';
import { singleClientStore } from '@/stores/clients';
import { useParams } from 'react-router-dom';
import styles from './deed.scss';
import { DownloadOutlined } from '@ant-design/icons';
import { clientsInfoApi } from '@/api/clients';
import { addNotification } from '@/utils';
import dayjs from 'dayjs';
import { priceFormat } from '@/utils/priceFormat';

const cn = classNames.bind(styles);

export const Deed = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');
  const { clientId } = useParams();
  const [downloadLoadingDeed, setDownLoadLoadingDeed] = useState(false);
  const [downloadLoadingDeedProduct, setDownLoadLoadingDeedProduct] = useState(false);


  const { data: clientDeedData, isLoading: loading } = useQuery({
    queryKey: ['getDeed', clientId, singleClientStore.startDate, singleClientStore.endDate],
    queryFn: () =>
      singleClientStore.getClientDeed({
        id: clientId!,
        startDate: singleClientStore?.startDate!,
        endDate: singleClientStore?.endDate!,
      }),
  });

  const handleStartDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      singleClientStore.setStartDate(null);
    }
    singleClientStore.setStartDate(new Date(dateString));
  };

  const handleEndDateChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (!dateString) {
      singleClientStore.setEndDate(null);
    }
    singleClientStore.setEndDate(new Date(dateString));
  };

  const handleDownloadExcelDeed = () => {
    setDownLoadLoadingDeed(true);
    clientsInfoApi.getUploadDeedToExel({
      id: clientId!,
      type: 'deed',
      startDate: singleClientStore?.startDate!,
      endDate: singleClientStore?.endDate!,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = `${singleClientStore?.activeClient?.name}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoadingDeed(false);
      });
  };

  const handleDownloadExcelDeedProducts = () => {
    setDownLoadLoadingDeedProduct(true);
    clientsInfoApi.getUploadDeedToExel({
      id: clientId!,
      type: 'product',
      startDate: singleClientStore?.startDate!,
      endDate: singleClientStore?.endDate!,
    })
      .then(res => {
        const url = URL.createObjectURL(new Blob([res]));
        const a = document.createElement('a');

        a.href = url;
        a.download = `${singleClientStore?.activeClient?.name}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(addNotification)
      .finally(() => {
        setDownLoadLoadingDeedProduct(false);
      });
  };

  return (
    <main>
      <div className={cn('deed__head')}>
        <Typography.Title level={3}>Solishtiruv dalolatnomalari</Typography.Title>
        <div className={cn('deed__filter')}>
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleStartDateChange}
            placeholder={'Boshlanish sanasi'}
            defaultValue={dayjs(singleClientStore.startDate)}
            allowClear={false}
          />
          <DatePicker
            className={cn('promotion__datePicker')}
            onChange={handleEndDateChange}
            placeholder={'Tugash sanasi'}
            defaultValue={dayjs(singleClientStore.endDate)}
            allowClear={false}
          />
          <Button
            onClick={handleDownloadExcelDeed}
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloadLoadingDeed}
          >
            Exelda Yuklash
          </Button>
          <Button
            onClick={handleDownloadExcelDeedProducts}
            type="primary"
            icon={<DownloadOutlined />}
            loading={downloadLoadingDeedProduct}
          >
            Mahsulotlar bilan yuklash
          </Button>
        </div>
      </div>

      <Table
        columns={deedColumns}
        dataSource={clientDeedData?.data || []}
        loading={loading}
        bordered
        summary={(pageData) => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3} index={0}>
                Jami
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                {/* @ts-ignore */}
                <div style={{ textAlign: 'center' }}>{priceFormat(clientDeedData?.totalDebt)}</div>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>
                {/* @ts-ignore */}
                <div style={{ textAlign: 'center' }}>{priceFormat(clientDeedData?.totalCredit)}</div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={3} index={0}>
                Umumiy farq
              </Table.Summary.Cell>
              <Table.Summary.Cell colSpan={2} index={2}>
                <div style={{ textAlign: 'center' }}>
                  {/* @ts-ignore */}
                  {priceFormat((clientDeedData?.totalDebt || 0) - (clientDeedData?.totalCredit || 0))}
                </div>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
        pagination={false}
      />
    </main>
  );
});
