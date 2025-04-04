import React from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames/bind';
import {Icons} from '@/components';
import {IBreadcrumb} from '@/stores/breadcrumb/types';
import styles from './menu.scss';

const cn = classNames.bind(styles);

type Props = {
  items: IBreadcrumb[];
};

export const NestedList = ({items}: Props) => {
  const renderItems = (item: IBreadcrumb, index: number) => {
    if (!item) {
      return null;
    }

    return (
      <ul className={cn('menu__child-list')}>
        <li className={cn('menu__item menu-last__link')}>
          {
            item?.link
              ? (
                <Link
                  className={cn('menu__items-link menu__last-items')}
                  to={item?.link}
                >
                  <>
                    <Icons.Breadcrumb className={cn('menu__child-icon')} />
                    {item?.children ? item?.children : item?.label}
                  </>
                </Link>
              )
              : item?.label
          }
        </li>
        {renderItems(items[index + 1], index + 1)}
      </ul>
    );
  };

  return (
    <div className={cn('menu__nested-menu')}>
      {renderItems(items[0], 0)}
    </div>
  );
};
