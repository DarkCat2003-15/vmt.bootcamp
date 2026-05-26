export interface CartProduct {
  id: number;
  title?: string;
  price?: number;
  quantity: number;
  total?: number;
  discountPercentage?: number;
}

export interface Cart {
  id: number;
  userId: number;
  products: CartProduct[];
  total?: number;
  discountedTotal?: number;
  totalProducts?: number;
  totalQuantity?: number;
}

export interface CartsResponse {
  carts: Cart[];
  total?: number;
  skip?: number;
  limit?: number;
}

export interface CartProductPayload {
  id: number;
  quantity: number;
}

export interface CartPayload {
  userId: number;
  products: CartProductPayload[];
}
