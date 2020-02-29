import { BanState } from "./BanState";
interface BanlistInfo {
    readonly tcg: BanState;
    readonly ocg: BanState;
    readonly goat: BanState;
}
export { BanlistInfo };
