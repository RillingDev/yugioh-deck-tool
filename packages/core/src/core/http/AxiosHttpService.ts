import type {
    HttpRequestConfig,
    HttpResponse,
    HttpService,
} from "./HttpService";
import type { AxiosInstance } from "axios";
import axios from "axios";
import { injectable } from "inversify";

/**
 * @private
 */
@injectable()
class AxiosHttpService implements HttpService {
    private readonly httpClient: AxiosInstance;

    constructor() {
        this.httpClient = axios.create({
            validateStatus: (status) => status === 200,
        });
    }

    get<TData>(
        url: string,
        requestConfig: HttpRequestConfig
    ): Promise<HttpResponse<TData>> {
        return axios.get<TData>(url, {
            ...requestConfig,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            baseURL: requestConfig.baseUrl,
        });
    }
}

export { AxiosHttpService };
