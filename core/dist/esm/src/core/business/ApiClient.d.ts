import { Card } from "../model/Card";
import { CardSet } from "../model/CardSet";
interface ApiClient {
    getCardInfo(): Promise<Card[]>;
    getCardSets(): Promise<CardSet[]>;
}
export { ApiClient };
//# sourceMappingURL=ApiClient.d.ts.map