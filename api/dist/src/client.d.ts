import { Card } from "./model/Card";
declare class Client {
    private readonly httpClient;
    constructor();
    getCardInfo(): Promise<Card[]>;
}
export { Client };
