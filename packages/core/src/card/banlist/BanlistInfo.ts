import type { BanState } from "./BanState";
import type { Format } from "../format/Format";

export interface BanlistInfo {
	readonly [Format.OCG]: BanState;
	readonly [Format.TCG]: BanState;
	readonly [Format.GOAT]: BanState;
}
