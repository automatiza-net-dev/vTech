import { CacheKeys, CacheValues } from "./cache-keys";

export interface GetStorage {
  get: <T extends CacheKeys>(key: CacheKeys) => Promise<CacheValues[T] | null>
}