export interface IMyProfile {
  id: number;
  photo: string;
  firstName: string;
  lastName: string;
  login: string;
  createdAt: string;
  roles: IRolesCheck[];
}

export enum UserStatus {
  NEW = 1,
  ACTIVE = 2,
  BLOCKED = 3,
}

export type TInitial = {
  version: string;
};

export enum IRolesCheck {
  SuperAdmin = 'super-admin',
  ProductManager = 'product-manager',
}
