export interface HttpRequestConfig<TData> {
    readonly baseUrl?: string;

    readonly params?: Record<string, string | number | boolean | null>;
    readonly data?: TData;
    readonly headers?: Record<string, string>;
    readonly auth?: {
        readonly username: string;
        readonly password: string;
    };

    readonly responseType: "json" | "text";
    readonly timeout: number;
    readonly validateStatus?: (status: number) => boolean;
}

export interface HttpResponse<TData> {
    readonly data: TData;
    readonly status: number;
    readonly statusText: string;
}

/**
 * HTTP client abstraction allowing for simple GET requests.
 */
export interface HttpService {
    get: <TResponse>(
        url: string,
        requestConfig: HttpRequestConfig<void>
    ) => Promise<HttpResponse<TResponse>>;
}
