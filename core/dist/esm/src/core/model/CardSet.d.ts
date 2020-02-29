import { ReleaseInfo } from "./ReleaseInfo";
interface CardSet {
    readonly name: string;
    readonly code: string;
    readonly cardCount: number;
    readonly release: ReleaseInfo | null;
}
export { CardSet };
