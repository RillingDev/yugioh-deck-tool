import { BanState } from "./BanState";
import { Format } from "../format/Format";

interface BanlistInfo {
    readonly [Format.OCG]: BanState;
    readonly [Format.TCG]: BanState;
    readonly [Format.GOAT]: BanState;
}

export { BanlistInfo };
