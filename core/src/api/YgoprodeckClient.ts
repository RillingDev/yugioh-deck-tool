import axios, { AxiosInstance } from "axios";
import { mapCardInfo } from "./mapping/mapCardInfo";
import { Card } from "../core/model/Card";
import { mapCardSets } from "./mapping/mapCardSets";
import { CardSet } from "../core/model/CardSet";
import { ApiClient } from "../core/business/ApiClient";

class YgoprodeckClient implements ApiClient {
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
        const response = await this.httpClient.get(
            "cardinfo.php?misc=yes&includeAliased",
            {
                timeout: 10000,
                data: {
                    misc: true
                },
                transformResponse: data => mapCardInfo(data)
            }
        );
        return response.data;
    }

    public async getCardSets(): Promise<CardSet[]> {
        const response = await this.httpClient.get("cardsets.php", {
            transformResponse: data => mapCardSets(data)
        });
        return response.data;
    }
}

export { YgoprodeckClient };
