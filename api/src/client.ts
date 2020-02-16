import axios, { AxiosInstance } from "axios";
import { Card } from "./model/Card";

class Client {
    private readonly httpClient: AxiosInstance;

    constructor() {
        this.httpClient = axios.create({
            baseURL: "https://db.ygoprodeck.com/api/v6/",
            timeout: 3000,
            responseType: "json",
            validateStatus: status => status === 200
        });
    }

    public async getCardInfo(): Promise<Card[]> {
        const response = await this.httpClient.get("cardinfo.php", {
            timeout: 10000,
            data: {
                misc: true,
                sort: "id"
            }
        });
        return response.data;
    }
}

export { Client };
