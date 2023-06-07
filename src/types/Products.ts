export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  discountedPrice?: number;
  quantity?: number;
}

export interface ProductImg {
  [key: string]: string;
}
