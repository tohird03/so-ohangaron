import {makeAutoObservable} from 'mobx';
import {IBreadcrumb} from './types';

class BreadcrumbStore {
  breadcrumbs: IBreadcrumb[] | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  addBreadcrumbs = (breadcrumbs: IBreadcrumb[]) => {
    this.breadcrumbs = breadcrumbs;
  };

  clearBreadcrumbs = () => {
    this.breadcrumbs = null;
  };

  addBreadcrumb = (breadcrumb: IBreadcrumb) => {
    if (!this.breadcrumbs) {
      this.breadcrumbs = [];
    }

    this.breadcrumbs.push(breadcrumb);
  };

  removeBreadcrumb = () => {
    this.breadcrumbs?.pop();
  };

  reset = () => {
    this.breadcrumbs = null;
  };

}

export const breadcrumbStore = new BreadcrumbStore();
