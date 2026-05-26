export interface Dimensions {
    width: number,
        height: number,
        depth: number
}

export interface Rewiews {
        comment: string,
        rating: number,
        date: Date,
        rewierName: string ,
        rewierEmail: string
}

export interface meta{
  creadedAt: Date,
  updatedAt: Date,
  barcode: string,
  qrCode: string

}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  category: string;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  images: string[];
  thumbnail: string;
  dimensions: Dimensions;
  reviews: Rewiews[];
  meta: meta;
}