export interface Category {
  id: number;
  name: string;
}

export interface Author {
  id: number;
  name: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string;
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  userId: number;
  categoryId: number;
  category: Category;
  author: Author;
}

export type BlogInput = Omit<
  Blog,
  "id" | "createdAt" | "updatedAt" | "category" | "author"
>;
