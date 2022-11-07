import axios, { AxiosInstance } from "axios";
import { removeTrailingSlashes } from "../utils/strings/removeTrailingSlashes";
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

const getContentOptionsToQueryParams = (options?: GetContentOptions) => {
  const expand = options?.expand || true;
  const editmode = options?.editmode || false;
  if (!expand && !editmode) return "";
  let query: any = {};
  if (expand) query[EXPAND_QUERY_KEY] = "*";
  if (editmode) query[EDITMODE_QUERY_KEY] = "True";
  return "?" + new URLSearchParams(query).toString();
};

export class CmsService {
  public readonly config: Config;
  private readonly axios: AxiosInstance;

  constructor(config: Config) {
    this.config = {
      version: config.version || "v2.0",
      language: config.language || "en",
      host: removeTrailingSlashes(config.host.trim()),
    };
    console.log("HOST", this.config.host);
    this.axios = axios.create({
      baseURL: this.config.host,
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": this.config.language,
      },
    });
  }

  public async getContent(id: number, options?: GetContentOptions) {
    const path =
      "/api/episerver/" +
      this.config.version +
      "/content/" +
      id +
      getContentOptionsToQueryParams(options);
    return this.axios.get(path).then((res) => res.data);
  }

  public async getContentChildren(id: number, options?: GetContentOptions) {
    const path =
      "/api/episerver/" + this.config.version + "/content/" + id + "/children";
    getContentOptionsToQueryParams(options);
    return this.axios.get(path).then((res) => res.data);
  }

  public async getWebsites() {
    const path = "/api/episerver/" + this.config.version + "/site";
    return this.axios
      .get(path)
      .then((res) => res.data)
      .catch(console.error);
  }
}
