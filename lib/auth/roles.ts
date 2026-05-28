export const businessRoles = ["owner", "operator"] as const;

export type BusinessRole = (typeof businessRoles)[number];

export type AppRole = BusinessRole | "super_admin";

export function isBusinessRole(role: string | null | undefined): role is BusinessRole {
  return role === "owner" || role === "operator";
}

export function canManageBilling(role: AppRole) {
  return role === "owner" || role === "super_admin";
}
