import {IBreadcrumb} from '@/stores/breadcrumb/types';

type ConfigMoreBreadcrumbItemsReturnType = {
  first?: IBreadcrumb;
  last?: IBreadcrumb;
  menuItems?: IBreadcrumb[];
};

export const configMoreBreadcrumbItems = (
  breadcrumbItems: IBreadcrumb[]
): ConfigMoreBreadcrumbItemsReturnType => {
  if (breadcrumbItems?.length < 3) {
    return {};
  }

  const [firstItem, ...more] = breadcrumbItems;

  return {
    first: firstItem,
    last: more[more.length - 1],
    menuItems: more.slice(0, -1),
  };
};
