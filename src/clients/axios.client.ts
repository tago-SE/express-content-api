import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";
import { removeTrailingSlashes } from "../utils/strings/removeTrailingSlashes.js";

interface ConstructorOptions extends CreateAxiosDefaults<any> {
  baseURL: string;
}

const DefaultTimeout = 45_000;

export class HttpClient {
  private readonly axios: AxiosInstance;

  constructor(config: ConstructorOptions) {
    const { baseURL, timeout, headers, ...rest } = config;
    const mergedConfig = {
      timeout: timeout && timeout > 5_000 ? timeout : DefaultTimeout,
      baseURL: removeTrailingSlashes(baseURL.trim()),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        ...headers,
      },
      ...rest,
    };
    this.axios = axios.create(mergedConfig);
  }
  request<T = any, R = AxiosResponse<T>>(
    config: AxiosRequestConfig
  ): Promise<R> {
    return this.axios.request(config);
  }

  async get<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.axios.get<T, R>(url, config);
  }

  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.axios.post<T, R>(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.axios.put<T, R>(url, data, config);
  }

  patch<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.axios.patch<T, R>(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.axios.delete<T, R>(url, config);
  }
}
