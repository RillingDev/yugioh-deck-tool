import { BanState } from "./BanState";
import { Format } from "./Format";
interface BanlistInfo {
    readonly [Format.OCG]: BanState;
    readonly [Format.TCG]: BanState;
    readonly [Format.GOAT]: BanState;
}
export { BanlistInfo };
