import { ADMIN, BUYER, SELLER, type ALLOWED_ROLES } from "@/utils/assets";

type RoleKey = keyof typeof ALLOWED_ROLES;

type NavItem = {
  label: string;
  path: string;
  roles: RoleKey[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    roles: [ADMIN],
  },
  {
    label: "Dashboard",
    path: "/buyer/dashboard",
    roles: [BUYER],
  },
  {
    label: "Dashboard",
    path: "/seller/dashboard",
    roles: [SELLER],
  },
  {
    label: "Companies",
    path: "/admin/companies",
    roles: [ADMIN],
  },
  {
    label: "My Company",
    path: "/seller/company",
    roles: [SELLER],
  },
  // {
  //   label: "My Products",
  //   path: "/seller/products",
  //   roles: [SELLER],
  // },
  // {
  //   label: "Orders",
  //   path: "/orders",
  //   roles: ["seller", "buyer"],
  // },
  // {
  //   label: "Cart",
  //   path: "/cart",
  //   roles: ["buyer"],
  // },
  // {
  //   label: "Addresses",
  //   path: "/addresses",
  //   roles: ["buyer"],
  // },
  {
    label: "Profile",
    path: "/profile",
    roles: [ADMIN, BUYER, SELLER],
  },
];
