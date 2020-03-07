import axios from "axios";
import { mapCardInfo } from "./mapping/mapCardInfo";
import { mapCardSets } from "./mapping/mapCardSets";
class YgoprodeckClient {
    constructor() {
        this.httpClient = axios.create({
            baseURL: "https://db.ygoprodeck.com/api/v7/",
            timeout: 3000,
            responseType: "json",
            validateStatus: status => status === 200
        });
    }
    async getCardInfo() {
        const responseData = await this.loadPaginated(YgoprodeckClient.CARD_INFO_CHUNK_SIZE, async (offset) => {
            const response = await this.httpClient.get("cardinfo.php", {
                params: {
                    misc: "yes",
                    includeAliased: "yes",
                    num: YgoprodeckClient.CARD_INFO_CHUNK_SIZE,
                    offset
                }
            });
            return response.data;
        });
        return mapCardInfo(responseData);
    }
    async getCardSets() {
        const response = await this.httpClient.get("cardsets.php");
        return mapCardSets(response.data);
    }
    async loadPaginated(pageSize, fetcher) {
        const result = [];
        let offset = 0;
        let total = null;
        while (total == null || result.length < total) {
            const response = await fetcher(offset);
            result.push(...response.data);
            if (total == null) {
                total = response.meta.total_rows;
            }
            offset += pageSize;
        }
        return result;
    }
}
YgoprodeckClient.CARD_INFO_CHUNK_SIZE = 2500;
export { YgoprodeckClient };
//# sourceMappingURL=YgoprodeckClient.js.map