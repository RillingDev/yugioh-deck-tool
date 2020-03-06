import { Format } from "./Format";

interface ReleaseInfo {
    readonly [Format.TCG]: string | null;
    readonly [Format.OCG]: string | null;
}

export { ReleaseInfo };
