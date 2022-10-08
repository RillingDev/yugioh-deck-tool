import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { injectable } from "inversify";

/**
 * HTTP client abstraction allowing for simple GET requests.
 */
@injectable()
export class HttpService {
	readonly #httpClient: AxiosInstance;

	constructor() {
		this.#httpClient = axios.create({
			validateStatus: (status) => status === 200,
		});
	}

	get<TResponse>(
		url: string,
		requestConfig: AxiosRequestConfig<void>
	): Promise<AxiosResponse<TResponse>> {
		return this.#httpClient.get<void, AxiosResponse<TResponse>>(
			url,
			requestConfig
		);
	}
}
