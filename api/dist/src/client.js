import axios from "axios";
import { mapCardInfo } from "./mapping/mapCardInfo";
import { mapCardSets } from "./mapping/mapCardSets";
class Client {
    constructor() {
        this.httpClient = axios.create({
            baseURL: "https://db.ygoprodeck.com/api/v6/",
            timeout: 3000,
            responseType: "json",
            validateStatus: status => status === 200
        });
    }
    async getCardInfo() {
        const response = await this.httpClient.get("cardinfo.php", {
            timeout: 10000,
            data: {
                misc: true
            },
            transformResponse: data => mapCardInfo(data)
        });
        return response.data;
    }
    async getCardSets() {
        const response = await this.httpClient.get("cardsets.php", {
            transformResponse: data => mapCardSets(data)
        });
        return response.data;
    }
}
export { Client };
