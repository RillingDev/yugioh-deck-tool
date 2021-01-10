interface HttpResponse<TData> {
    data: TData;
    status: number;
    statusText: string;
}

interface HttpRequestConfig {
    timeout: number;
    responseType: "json" | "text";
    baseUrl?: string;
    params?: Record<string, string | number | boolean | null>;
    data?: Record<string, string | number | boolean | null>;
    validateStatus?: (status: number) => boolean;
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
