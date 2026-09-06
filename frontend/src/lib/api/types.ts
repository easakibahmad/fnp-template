export interface MeProfile {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleRecord {
  id: string;
  roleName: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  name: string;
  roles: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminUsersPage {
  items: AdminUserRecord[];
  meta: PageMeta;
}
