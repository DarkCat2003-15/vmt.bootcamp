export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface Feature {
  icon: string;
  title: string;
  desc: string;
  color: string;
}