export interface Fruit {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string;
  tags: string[];
  categories: Category[];
  importDate: string;
  origin: string;
  weight: number;
  stockStatus: string;
  discount: number;
}

export interface FruitPOST {
  name: string;
  price: number;
  quantity: number;
  description: string;
  image: string;
  tags: string[];
  categories: Category[];
  importDate: string;
  origin: string;
  weight: number;
  stockStatus: string;
  discount: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface PaginatedFruits {
  content: Fruit[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface PaginatedCategories {
  content: Category[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
