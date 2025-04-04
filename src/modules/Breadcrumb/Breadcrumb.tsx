import React from 'react';
import classNames from 'classnames/bind';
import {SimpleBreadcrumb, WithButtonBreadcrumb} from './components';
import styles from './styles.scss';
import {BreadcrumbType} from './types';
const cn = classNames.bind(styles);

export const Breadcrumb = ({items}: BreadcrumbType): React.ReactElement => {
  const isSimple = items && items.length <= 3;

  if (!items) {
    return <></>;
  }

  return (
    <div>
      <ul className={cn('breadcrumb__items')}>
        {isSimple ? (
          <SimpleBreadcrumb items={items} />
        ) : (
          <WithButtonBreadcrumb items={items} />
        )}
      </ul>
    </div>
  );
};
