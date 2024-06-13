import { Product } from "./entities";

export type LoadAllProducts = {
  loadAllProducts: () => Promise<LoadAllProducts.Model>;
};

export namespace LoadAllProducts {
  export type Model = Product[];
}
