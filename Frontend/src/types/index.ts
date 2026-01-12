export interface NavItem {
  title: string;
  href?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  card?: NavItemWithChildren[];
  menu?: NavItemWithChildren[];
}

export type Image = {
  id: number;
  path: string;
};

export type Tag = {
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  images: Image[];
  categoryId: string;
  price: number;
  discount: number;
  rating: number;
  review: string[];
  inventory: number;
  status: string;
  pstatus: string;
};

export type Category = {
  id: number;
  name: string;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  address: string;
  city: string;
  region: string;
  email: string;
  phone: string;
  image: string;
  role: string;
  createdAt: Date;
};

export type Cart = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Review = {
  id: string;
  rating: number;
  comment?: string;
  status: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    imageUrl: string;
  };
};
export interface CurrentUser {
  id: number;
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "FREEZE";
  image?: string;
  lastLogin?: string;
}

export type MainNavItem = NavItemWithChildren;
