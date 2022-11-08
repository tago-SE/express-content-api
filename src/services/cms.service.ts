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

export interface PageTree {
  data: any | null;
  children: PageTree[];
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

const throttle = pThrottle({
  limit: 10,
  interval: 1000,
});

const myRedisCache = new RedisCache({ ttl: 1 * 24 * 60 * 60 });

const isPage = (content: any) => {
  if (!content) return false;
  return content.contentType[0] === "Page";
};

export class CmsService {
  public readonly config: Config;
  private readonly httpClient: HttpClient;

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
    return _url.hostname + _url.pathname + _url.search;
  }

  private async _handleSuccess(res: AxiosResponse<any, any>) {
    try {
      const key = this.getCacheKey(res.config.url || "");
      const saveResult = await myRedisCache.set(key, res.data);
      if (saveResult) console.log("Saved", key);
    } catch (error) {
      console.error(error);
    }
    return res.data;
  }

  private _shouldRemoveOnError(response: AxiosResponse<any, any>) {
    // TODO: Check if the error response view model matches what is sent from EPI Server CMS rather
    // than checking the content-type of the header etc
    if (!response) return false;
    const status = response.status;
    const { ["content-type"]: headerContentType } = response.headers;
    if (
      response.status === 404 &&
      !headerContentType?.includes("application/json")
    ) {
      return false; // If the 404 response is not a json it means that the server is likely down
    }
    return status >= 400 && status <= 404;
  }

  private async _handleError(error: AxiosError<any>) {
    console.error(error.toString());
    if (error.isAxiosError) {
      const requestConfig = error.config as AxiosRequestConfig<any>;
      const key = this.getCacheKey(requestConfig.url || "");
      if (!!error.response) {
        if (this._shouldRemoveOnError(error.response)) {
          const saveResult = await myRedisCache.set(key, null);
          if (saveResult) console.log("Removed", key);
          return Promise.resolve(null);
        } else {
          console.warn(
            "The error could not be parsed properly. Perhaps the server is down?"
          );
          console.log(
            error.response.status,
            error.response.data,
            error.response.headers
          );
        }
      }
      const cachedResult = await myRedisCache.get(key);
      return Promise.resolve(cachedResult.value);
    }
    return Promise.reject(error);
  }

  private async _handleGetRequest(url: string) {
    return this.httpClient
      .get(url)
      .then((res) => this._handleSuccess(res))
      .catch((error) => this._handleError(error));
  }

  private _checkExpiration(savedAt: Date, expirationTimeInSeconds: number) {
    if (!savedAt)
      return {
        hasExpired: true,
        elapsed: 0,
      };
    const elapsed = Math.abs(
      differenceInSeconds(new Date(), new Date(savedAt))
    );
    return {
      hasExpired: elapsed > expirationTimeInSeconds,
      elapsed,
    };
  }

  private async _readThroughGetRequest(url: string) {
    const key = this.getCacheKey(url);
    const cacheResult = await myRedisCache.get(key);
    if (!cacheResult.cacheHit) {
      return this._handleGetRequest(url);
    }
    const { hasExpired, elapsed } = this._checkExpiration(
      cacheResult.meta?.savedAt as Date,
      BackgroundExpirationTimeInSeconds
    );
    if (hasExpired) {
      console.log(`Expired after ${elapsed}s : ${key}`);
      setImmediate(async () => {
        try {
          await myRedisCache.set(key, cacheResult.value); // touch timestamp to prevent spam
          await throttle(() => this._handleGetRequest(url))();
        } catch (error) {
          console.error(error);
        }
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
    return this._readThroughGetRequest(url);
  }

  public async getContentChildren(id: number, options?: GetContentOptions) {
    const url =
      "/api/episerver/" +
      this.config.version +
      "/content/" +
      id +
      "/children" +
      getContentOptionsToQueryParams(options);
    return this._readThroughGetRequest(url);
  }

  public async getPageTree(rootPageId: number, options?: GetContentOptions) {
    console.log(rootPageId, options);
    const rootContent = [await this.getContent(rootPageId, options)].find(
      isPage
    );
    const root: PageTree = {
      data: rootContent || null,
      children: [],
    };
    if (root.data) {
      let q = [root];
      while (q.length > 0) {
        const node = q.pop() as PageTree;
        const children = (
          await this.getContentChildren(node.data.contentLink.id, options)
        ).filter(isPage);
        node.children = children.map((childContent: any) => ({
          data: childContent,
          children: [],
        }));
        for (let child of node.children) {
          q.push(child);
        }
      }
    }
    return root;
  }

  public async getWebsites() {
    const url = "/api/episerver/" + this.config.version + "/site";
    return this.httpClient
      .get(url)
      .then((res) => this._handleSuccess(res))
      .catch((error) => this._handleError(error));
  }
}

export const cmsService = new CmsService({
  host: "https://dev.prod.cms.developer.if-insurance.com/",
});
