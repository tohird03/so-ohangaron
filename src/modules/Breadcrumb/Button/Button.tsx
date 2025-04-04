import React from 'react';
import classNames from 'classnames/bind';
import styles from './button.scss';

const cn = classNames.bind(styles);

type Props = {
  onClick?: () => void;
  children?: React.ReactNode;
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({children, onClick}: Props, ref) => (
    <button
      className={cn('button')}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  )
);
