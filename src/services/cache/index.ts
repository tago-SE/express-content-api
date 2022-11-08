export interface CachedMetaData {
  savedAt: Date;
  key: string;
  setOption: any;
}

export interface CachedData {
  value: any;
  meta?: CachedMetaData;
}

export interface GetCachedValue extends CachedData {
  cacheHit: boolean;
}

export interface SetOptions {
  /**
   * TTL in seconds until expiration
   */
  ttl?: number;
}

export interface ICache {
  /**
   * Get value from cache
   */
  get(key: string): Promise<GetCachedValue>;
  /**
   * Save value to cache
   */
  set(key: string, value: any, options?: SetOptions): Promise<boolean>;
  /**
   * Delete cached value.
   * Returns 1 if the cached value was deleted, 0 if there was no cached value to delete.
   */
  del(key: string): Promise<number>;
  /**
   * Returns the expiration time in seconds. TTL <= 0 should be considered as expired.
   * -1, if the key does not have expiry timeout. -2, if the key does not exist.
   */
  ttl(key: string): Promise<number>;
  /**
   * Returns true if the cached value exists.
   */
  has(key: string): Promise<boolean>;
  /**
   * Health check the cache server.
   * Returns "PONG" if the remote cache is reachable.
   */
  ping(): Promise<string | null>;
}

export interface CacheConfig {
  ttl?: number;
}
