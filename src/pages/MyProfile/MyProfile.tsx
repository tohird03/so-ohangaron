{/* @ts-ignore */}
// eslint-disable-next-line import/no-extraneous-dependencies
import '@google/model-viewer';

import React from 'react';
import {observer} from 'mobx-react';
import {Badge, Card, Skeleton, Typography} from 'antd';
import classNames from 'classnames';
import {appRoles} from '@/modules/Layout/constants';
import {IAppRole} from '@/modules/Layout/types';
import {authStore} from '@/stores/auth';
import {useMediaQuery} from '@/utils/mediaQuery';
import styles from './my-profile.scss';

const cn = classNames.bind(styles);

export const MyProfile = observer(() => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  return (
    <main>
      <Card className={cn('my-profile__card')}>
        <div>
          {authStore?.staffInfo
            ? (
              <>
                <Typography.Title className={cn('my-profile__title')} level={4}>
                   Username: {authStore?.staffInfo?.name}
                </Typography.Title>
                <Typography.Title className={cn('my-profile__title')} level={4}>
                   Phone: +{authStore?.staffInfo?.phone}
                </Typography.Title>
              </>
            )
            : (
              <>
                <Skeleton />
                <Skeleton />
              </>
            )
          }
        </div>

        <div>
          {/* @ts-ignore */}
          <model-viewer
            src="https://arkon.uz/arkon/mono7.glb"
            alt="A 3D model of an astronaut"
            ar
            auto-rotate
            camera-controls
            ar-status="not-presenting"
            style={{width: '100%', height: '500px'}}
          />
        </div>
      </Card>
    </main>
  );
});
