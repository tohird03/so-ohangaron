import {ReactNode} from 'react';

export interface IBreadcrumb {
  label?: string;
  icon?: ReactNode;
  link?: string;
  children?: ReactNode;
}
