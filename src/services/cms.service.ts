import pThrottle from "p-throttle";
import pLimit from "p-limit";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { differenceInSeconds } from "date-fns";

import { removeTrailingSlashes } from "../utils/strings/removeTrailingSlashes.js";
import { HttpClient } from "../clients/axios.client.js";
import { RedisCache } from "./cache/RedisCache.js";

const EXPAND_QUERY_KEY = "expand";
const EDITMODE_QUERY_KEY = "epieditmode";

interface Config {
  host: string;
  version?: string;
  language?: string;
}

export interface GetContentOptions {
  editmode?: boolean;
  expand?: boolean;
}

const BackgroundExpirationTimeInSeconds = 15;

const getContentOptionsToQueryParams = (options?: GetContentOptions) => {
  const expand = options?.expand || true;
  const editmode = options?.editmode || false;
  if (!expand && !editmode) return "";
  let query: any = {};
  if (expand) query[EXPAND_QUERY_KEY] = "*";
  if (editmode) query[EDITMODE_QUERY_KEY] = "True";
  return "?" + new URLSearchParams(query).toString();
};

const myRedisCache = new RedisCache({ ttl: 7 * 24 * 60 * 60 });

export class CmsService {
  public readonly config: Config;
  private httpClient: HttpClient;

  constructor(config: Config) {
    this.config = {
      version: config.version || "v2.0",
      language: config.language || "en",
      host: removeTrailingSlashes(config.host.trim()),
    };
    this.httpClient = new HttpClient({
      baseURL: this.config.host,
      headers: {
        "Accept-Language": this.config.language,
      },
    });
  }

  private getCacheKey(url: string) {
    const _url = new URL(this.config.host + url);
    return _url.hostname + _url.pathname + _url.search + "11_";
  }

  private async handleSuccess(res: AxiosResponse<any, any>) {
    try {
      const key = this.getCacheKey(res.config.url || "");
      const saveResult = await myRedisCache.set(key, res.data);
      if (saveResult) {
        console.log("Saved", key);
      }
    } catch (error) {
      console.error(error);
    }
    return res.data;
  }

  private async handleError(error: AxiosError<any>) {
    console.error(error.toString());
    if (error.isAxiosError) {
      const requestConfig = error.config as AxiosRequestConfig<any>;
      const key = this.getCacheKey(requestConfig.url || "");
      if (!!error.response && !!error.response.status) {
        const responseStatus = error.response.status;
        if (responseStatus >= 400 && responseStatus <= 404) {
          // Error codes between 400-404 cause the underlying data to be considered as removed
          await myRedisCache.set(key, null);
          return Promise.resolve(null);
        }
      }
      const cachedResult = await myRedisCache.get(key);
      return Promise.resolve(cachedResult.value);
    }
    return Promise.reject(error);
  }

  private async handleGetRequest(url: string) {
    return this.httpClient
      .get(url)
      .then((res) => this.handleSuccess(res))
      .catch((error) => this.handleError(error));
  }

  private async readThroughGetRequest(url: string) {
    const key = this.getCacheKey(url);
    const cacheResult = await myRedisCache.get(key);
    if (!cacheResult.cacheHit) {
      return this.handleGetRequest(url);
    }
    const elapsed =
      Math.abs(
        differenceInSeconds(
          new Date(),
          new Date(cacheResult?.meta?.savedAt as Date)
        )
      ) || 0;
    const hasExpired = elapsed > BackgroundExpirationTimeInSeconds;
    if (hasExpired) {
      console.log(`Expired after ${elapsed}s : ${key}`);
      setImmediate(async () => {
        await myRedisCache.set(key, cacheResult.value); // touched before update to prevent spam
        await this.handleGetRequest(url);
      });
    } else {
      console.log("Hit", key);
    }
    return cacheResult.value;
  }

  public async getContent(id: number, options?: GetContentOptions) {
    const url =
      "/api/episerver/" +
      this.config.version +
      "/content/" +
      id +
      getContentOptionsToQueryParams(options);
    return this.readThroughGetRequest(url);
  }

  public async getContentChildren(id: number, options?: GetContentOptions) {
    const url =
      "/api/episerver/" +
      this.config.version +
      "/content/" +
      id +
      "/children" +
      getContentOptionsToQueryParams(options);
    return this.readThroughGetRequest(url);
  }

  public async getContentTree(rootPageId: number, options?: GetContentOptions) {
    const root = await this.getContent(rootPageId);
    console.log("ROOT", root);
    let q = [root];
    while (q.length > 0) {
      const children = this.getContentChildren(root.contentLink.id, options);
      // TODO
    }
  }

  public async getWebsites() {
    const url = "/api/episerver/" + this.config.version + "/site";
    return this.httpClient
      .get(url)
      .then((res) => this.handleSuccess(res))
      .catch((error) => this.handleError(error));
  }
}

export const cmsService = new CmsService({
  host: "https://dev.prod.cms.developer.if-insurance.com/",
});
