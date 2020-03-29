interface HttpResponse<TData> {
    data: TData;
    status: number;
    statusText: string;
}

interface HttpRequestConfig {
    baseURL?: string;
    headers?: any;
    params?: any;
    data?: any;
    timeout: number;
    responseType: "json" | "text";
}

/**
 * HTTP client abstraction allowing for simple GET requests.
 */
interface HttpService {
    get<TData>(
        url: string,
        requestConfig: HttpRequestConfig
    ): Promise<HttpResponse<TData>>;
}

export { HttpService, HttpRequestConfig, HttpResponse };
