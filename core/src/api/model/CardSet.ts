import { ReleaseInfo } from "./ReleaseInfo";

interface CardSet {
    name: string;
    code: string;
    cardCount: number;
    release: ReleaseInfo | null;
}

export { CardSet };
