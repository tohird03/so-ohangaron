import {useEffect} from 'react';
import {breadcrumbStore} from '@/stores/breadcrumb';
import {IBreadcrumb} from '@/stores/breadcrumb/types';

export function useBreadcrumbs(breadcrumbs: IBreadcrumb[]) {
  useEffect(() => {
    breadcrumbStore.addBreadcrumbs(breadcrumbs);

    return () => breadcrumbStore.clearBreadcrumbs();
  }, []);

}
