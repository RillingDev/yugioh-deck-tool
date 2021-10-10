import type {
    HttpRequestConfig,
    HttpResponse,
    HttpService,
} from "./HttpService";
import type { AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";
import { injectable } from "inversify";

@injectable()
export class AxiosHttpService implements HttpService {
    readonly #httpClient: AxiosInstance;

    constructor() {
        this.#httpClient = axios.create({
            validateStatus: (status) => status === 200,
        });
    }

    get<TResponse>(
        url: string,
        requestConfig: HttpRequestConfig<void>
    ): Promise<HttpResponse<TResponse>> {
        return axios.get<void, AxiosResponse<TResponse>>(url, {
            ...requestConfig,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            baseURL: requestConfig.baseUrl,
        });
    }
}
