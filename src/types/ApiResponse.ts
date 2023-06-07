import { Product } from "./Products";

export interface GetProductResp {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
