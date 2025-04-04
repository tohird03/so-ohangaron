import type {TableProps} from 'antd/es/table';
import {DraggableBodyRow} from './DraggableBodyRow';

export const type = 'DraggableBodyRow';

export const components: TableProps<any>['components'] = {
  body: {
    row: DraggableBodyRow,
  },
};
