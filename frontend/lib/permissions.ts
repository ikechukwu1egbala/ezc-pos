export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "CASHIER"
  | "INVENTORY_OFFICER"
  | "ACCOUNTANT"
  | "VIEWER";

export type Permission =
  | "dashboard.view"
  | "sales.view"
  | "sales.create"
  | "sales.refund"
  | "products.view"
  | "products.create"
  | "products.edit"
  | "products.delete"
  | "inventory.view"
  | "inventory.adjust"
  | "inventory.history"
  | "reports.view"
  | "users.view"
  | "users.manage"
  | "branches.view"
  | "branches.manage"
  | "settings.manage";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    "dashboard.view",
    "sales.view",
    "sales.create",
    "sales.refund",
    "products.view",
    "products.create",
    "products.edit",
    "products.delete",
    "inventory.view",
    "inventory.adjust",
    "inventory.history",
    "reports.view",
    "users.view",
    "users.manage",
    "branches.view",
    "branches.manage",
    "settings.manage",
  ],

  ADMIN: [
    "dashboard.view",
    "sales.view",
    "sales.create",
    "sales.refund",
    "products.view",
    "products.create",
    "products.edit",
    "products.delete",
    "inventory.view",
    "inventory.adjust",
    "inventory.history",
    "reports.view",
    "users.view",
    "users.manage",
    "branches.view",
    "branches.manage",
    "settings.manage",
  ],

  MANAGER: [
    "dashboard.view",
    "sales.view",
    "sales.create",
    "sales.refund",
    "products.view",
    "products.create",
    "products.edit",
    "inventory.view",
    "inventory.adjust",
    "inventory.history",
    "reports.view",
    "users.view",
  ],

  CASHIER: [
    "dashboard.view",
    "sales.view",
    "sales.create",
    "products.view",
  ],

  INVENTORY_OFFICER: [
    "dashboard.view",
    "products.view",
    "products.create",
    "products.edit",
    "inventory.view",
    "inventory.adjust",
    "inventory.history",
  ],

  ACCOUNTANT: [
    "dashboard.view",
    "sales.view",
    "reports.view",
  ],

  VIEWER: [
    "dashboard.view",
    "sales.view",
    "products.view",
    "inventory.view",
    "inventory.history",
    "reports.view",
  ],
};

export function hasPermission(
  role: UserRole,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getRolePermissions(
  role: UserRole
): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}