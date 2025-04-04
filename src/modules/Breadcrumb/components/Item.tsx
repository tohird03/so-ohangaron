import React from 'react';
import {Link} from 'react-router-dom';
import classNames from 'classnames/bind';
import {IBreadcrumb} from '@/stores/breadcrumb/types';
import styles from './breadcrumbs.scss';

const cn = classNames.bind(styles);

export const Item = ({label, link, children}: IBreadcrumb) => (
  <li className={cn('breadcrumb-items__item')}>
    {link
      ? (
        <Link className={cn('breadcrumb-items__link')} to={link}>
          {children ? children : label}
        </Link>
      )
      : (
        <span className={cn('breadcrumb-items__element')}>
          {children ? children : label}
        </span>
      )
    }
  </li>
);
