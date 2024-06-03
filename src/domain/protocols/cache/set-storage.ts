import { CacheKeys, CacheValues } from "./cache-keys";

export interface SetStorage  {
  set: <T extends CacheKeys>(key: T, value: CacheValues[T]) => Promise<any>;
};