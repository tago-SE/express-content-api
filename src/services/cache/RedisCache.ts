import { RedisClientType } from "redis";
import {
  CacheConfig,
  CachedData,
  GetCachedValue,
  ICache,
  SetOptions as ISetOptions,
} from "./index.js";
import { redisClient } from "../../clients/redis.client.js";
import { CachedMetaData } from "./index.js";

export class RedisCache implements ICache {
  private readonly client: RedisClientType<any, any, any>;
  private readonly config: CacheConfig;

  constructor(config: CacheConfig) {
    this.client = redisClient;
    this.config = config;
  }

  private async ensureConnected() {
    if (this.client.isOpen) return;
    if (!this.client.isOpen) await this.client.connect();
  }

  public async set(
    key: string,
    value: any,
    options?: ISetOptions
  ): Promise<boolean> {
    await this.ensureConnected();
    const redisSetOption = {
      EX: typeof options?.ttl === "number" ? options.ttl : this.config.ttl,
    };
    const meta: CachedMetaData = {
      key,
      savedAt: new Date(),
      setOption: redisSetOption,
    };
    const dataToSave: CachedData = {
      value: value,
      meta: meta,
    };
    const result = await this.client.set(
      key,
      JSON.stringify(dataToSave),
      redisSetOption
    );
    return result === "OK";
  }

  public async getSet(key: string, value: any, options?: ISetOptions) {
    // TODO: Implement getset command
    // const redisSetOption = {
    //   EX: typeof options?.ttl === "number" ? options.ttl : this.config.ttl,
    // };
    // const meta: CachedMetaData = {
    //   key,
    //   savedAt: new Date(),
    //   setOption: redisSetOption,
    // };
    // const dataToSave: CachedData = {
    //   value: value,
    //   meta: meta,
    // };
    // const result = await this.client.getSet(
    //   key,
    //   JSON.stringify(dataToSave),
    //   redisSetOption
    // );
    // return result === "OK";
  }

  public async get(key: string): Promise<GetCachedValue> {
    await this.ensureConnected();
    return await this.client.get(key).then((str) => {
      const data: CachedData = JSON.parse(str as string);
      if (data) return { ...data, cacheHit: true };
      return { value: null, cacheHit: false };
    });
  }

  public async del(key: string): Promise<number> {
    await this.ensureConnected();
    return await this.client.del(key);
  }

  public async ttl(key: string): Promise<number> {
    await this.ensureConnected();
    return await this.client.ttl(key);
  }

  public async has(key: string): Promise<boolean> {
    await this.ensureConnected();
    return (await this.client.exists(key)) === 1;
  }

  public async ping(): Promise<string | null> {
    await this.ensureConnected();
    return await this.client.ping();
  }
}
