export interface HttpRequestConfig<TData> {
	readonly baseUrl?: string;

	readonly data?: TData;
	readonly headers?: Record<string, string>;
	readonly params?: Record<string, string | number | boolean | null>;

	readonly responseType: "json" | "text";
	readonly timeout: number;
	readonly validateStatus?: (status: number) => boolean;
	readonly auth?: {
		readonly username: string;
		readonly password: string;
	};
}

export interface HttpResponse<TData> {
	readonly status: number;
	readonly statusText: string;

	readonly data: TData;
	readonly headers: Record<string, string>;
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
