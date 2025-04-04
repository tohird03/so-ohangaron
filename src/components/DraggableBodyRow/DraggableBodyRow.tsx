import React, {FC, useEffect, useRef} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import classnamesBind from 'classnames/bind';
import {type} from './constants';
import styles from './draggable-body-row.scss';
import {DraggableBodyRowProps} from './types';

const cn = classnamesBind.bind(styles);

export const DraggableBodyRow: FC<DraggableBodyRowProps> = ({
  index,
  moveRow,
  className,
  ...restProps
}) => {
  const ref = useRef<HTMLTableRowElement>(null);
  const [classnames, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const {index: dragIndex} = monitor.getItem() || {};

      if (dragIndex === index) {
        return className;
      }

      const direction = dragIndex < index
        ? 'downward'
        : 'upward';

      return cn(className, {
        [`drop-over--${direction}`]: monitor.isOver(),
      });
    },
    drop: (item: {index: number}) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: {index},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  useEffect(() => {
    drop(drag(ref));
  }, []);

  return (
    <tr
      ref={ref}
      className={classnames}
      {...restProps}
    />
  );
};
