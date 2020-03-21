import { HttpRequestConfig, HttpResponse, HttpService } from "./HttpService";
import axios, { AxiosInstance } from "axios";
import { injectable } from "inversify";

@injectable()
class AxiosHttpService implements HttpService {
    private readonly httpClient: AxiosInstance;

    constructor() {
        this.httpClient = axios.create({
            validateStatus: status => status === 200
        });
    }

    get<TData>(
        url: string,
        requestConfig: HttpRequestConfig
    ): Promise<HttpResponse<TData>> {
        return axios.get<TData>(url, requestConfig);
    }
}

export { AxiosHttpService };
