import React, {createRef, useMemo, useState} from 'react';
import classNames from 'classnames/bind';
import {useOnClickOutside} from 'usehooks-ts';
import {Button} from '../Button';
import {SEPARATOR_CHAR} from '../constants';
import {Menu} from '../Menu';
import {Portal} from '../Portal';
import {BreadcrumbType} from '../types';
import {configMoreBreadcrumbItems} from '../utils';
import styles from './breadcrumbs.scss';
import {Item} from './Item';

const cn = classNames.bind(styles);


export const WithButtonBreadcrumb = ({
  items,
}: BreadcrumbType): React.ReactElement => {
  const [isVisibleMenu, setIsVisibleMenu] = useState(false);
  const buttonRef = createRef<HTMLButtonElement>();
  const menuRef = createRef<HTMLDivElement>();
  const {first, last, menuItems} = useMemo(
    () => configMoreBreadcrumbItems(items!),
    [items]
  );

  const handleClick = () => {
    setIsVisibleMenu((prev) => !prev);
  };

  const handleClickOutside = () => {
    setIsVisibleMenu(false);
  };

  useOnClickOutside(menuRef, handleClickOutside);

  return (
    <>
      <Item {...first!} />
      <li className={cn('breadcrumb-items__item separator')}>{SEPARATOR_CHAR}</li>
      <Item>
        <Button ref={buttonRef} onClick={handleClick}>
          &middot;&middot;&middot;
        </Button>
      </Item>
      <li className={cn('breadcrumb-items__item separator')}>{SEPARATOR_CHAR}</li>
      <Item {...last!} />
      {isVisibleMenu && (
        <Portal elementRef={buttonRef}>
          <div
            ref={menuRef}
            className={cn('menu-block')}
          >
            <Menu items={menuItems!} />
          </div>
        </Portal>
      )}
    </>
  );
};
