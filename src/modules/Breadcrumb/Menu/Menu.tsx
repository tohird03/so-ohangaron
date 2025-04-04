import React from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames/bind';
import {Icons} from '@/components';
import {IBreadcrumb} from '@/stores/breadcrumb/types';
import {breadcrumbLastItems} from './constants';
import styles from './menu.scss';

const cn = classNames.bind(styles);

type Props = {
  items: IBreadcrumb[];
};

export const Menu = ({items}: Props) => {
  const [firstItem, ...lastItems] = items;

  return (
    <ul className={cn('menu-block__list')}>
      <li className={cn('menu-link')}>
        {
          firstItem?.link
            ? (
              <Link
                className={cn('breadcrumb-items__link')}
                to={firstItem?.link}
              >
                {firstItem?.label}
              </Link>
            ) : firstItem?.label
        }
      </li>
      {lastItems.map(({label, link, children}, index) => (
        <li
          className={cn('menu-link menu-last__link')}
          key={index}
        >
          {
            link
              ? (
                <Link
                  className={cn('breadcrumb-items__link menu-last__items')}
                  to={link}
                  style={breadcrumbLastItems(index)}
                >
                  <>
                    <Icons.Breadcrumb className={cn('breadcrumb__icon')} />
                    {children ? children : label}
                  </>
                </Link>
              ) : label
          }
        </li>
      ))}
    </ul>
  );
};
