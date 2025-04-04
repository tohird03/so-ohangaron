import {HTMLAttributes} from 'react';

export interface DraggableBodyRowProps extends HTMLAttributes<HTMLTableRowElement> {
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
}

