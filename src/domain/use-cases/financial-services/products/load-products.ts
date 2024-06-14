import { Product } from "./product";

export type LoadAllProducts = {
  loadAll: () => Promise<LoadAllProducts.Model>;
};

export namespace LoadAllProducts {
  export type Model = Product[];
}
