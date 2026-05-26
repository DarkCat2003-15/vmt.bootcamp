export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  images?: string[];
  brand?: string;
  stock?: number;
  rating?: number;
  discountPercentage?: number;
  sku?: string;
}

export interface ProductsResponse {
  products: Product[];
  total?: number;
  skip?: number;
  limit?: number;
}

export interface ProductCategoriesResponse {
  value: string[];
  Count: number;
}

export interface ProductPayload {
  title: string;
  description: string;
  price: number;
  category: string;
  thumbnail: string;
  stock: number;
  brand?: string;
}
