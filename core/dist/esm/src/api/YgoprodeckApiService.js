var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var YgoprodeckApiService_1;
import axios from "axios";
import { mapCardInfo } from "./mapping/mapCardInfo";
import { mapCardSets } from "./mapping/mapCardSets";
import { injectable } from "inversify";
let YgoprodeckApiService = YgoprodeckApiService_1 = class YgoprodeckApiService {
    constructor() {
        this.httpClient = axios.create({
            baseURL: "https://ygoprodeck.com/api/v6/",
            timeout: 3000,
            responseType: "json",
            validateStatus: status => status === 200
        });
    }
    async getCardInfo() {
        const responseData = await this.loadPaginated(YgoprodeckApiService_1.CARD_INFO_CHUNK_SIZE, async (offset) => {
            const response = await this.httpClient.get("cardinfo.php", {
                params: {
                    misc: "yes",
                    includeAliased: "yes",
                    num: YgoprodeckApiService_1.CARD_INFO_CHUNK_SIZE,
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
};
YgoprodeckApiService.CARD_INFO_CHUNK_SIZE = 2500;
YgoprodeckApiService = YgoprodeckApiService_1 = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], YgoprodeckApiService);
export { YgoprodeckApiService };
//# sourceMappingURL=YgoprodeckApiService.js.map