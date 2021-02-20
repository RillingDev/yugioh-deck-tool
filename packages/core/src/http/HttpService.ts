interface HttpResponse<TData> {
    readonly data: TData;
    readonly status: number;
    readonly statusText: string;
}

interface HttpRequestConfig {
    readonly baseUrl?: string;

    readonly params?: Record<string, string | number | boolean | null>;
    readonly data?: Record<string, string | number | boolean | null>;
    readonly headers?: Record<string, string | number | boolean | null>;
    readonly auth?: {
        readonly username: string;
        readonly password: string;
    };

    readonly responseType: "json" | "text";
    readonly timeout: number;
    readonly validateStatus?: (status: number) => boolean;
}

/**
 * HTTP client abstraction allowing for simple GET requests.
 */
interface HttpService {
    get: <TData>(
        url: string,
        requestConfig: HttpRequestConfig
    ) => Promise<HttpResponse<TData>>;
}

export { HttpService, HttpRequestConfig, HttpResponse };
