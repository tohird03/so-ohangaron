import React from 'react';
import classNames from 'classnames/bind';
import {SEPARATOR_CHAR} from '../constants';
import {BreadcrumbType} from '../types';
import styles from './breadcrumbs.scss';
import {Item} from './Item';

const cn = classNames.bind(styles);

export const SimpleBreadcrumb = ({
  items,
}: BreadcrumbType): React.ReactElement => (
  <>
    {items?.map((item, index) => (
      <>
        {index !== 0 && (
          <li className={cn('simple-breadcrumb__items separator')}>{SEPARATOR_CHAR}</li>
        )}
        <Item {...item} />
      </>
    ))}
  </>
);
