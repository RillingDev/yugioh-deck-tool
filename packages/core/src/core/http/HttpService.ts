interface HttpResponse<TData> {
    data: TData;
    status: number;
    statusText: string;
}

interface HttpRequestConfig {
    baseUrl?: string;

    params?: Record<string, string | number | boolean | null>;
    data?: Record<string, string | number | boolean | null>;
    auth?: {
        username: string;
        password: string;
    };

    responseType: "json" | "text";
    timeout: number;
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
