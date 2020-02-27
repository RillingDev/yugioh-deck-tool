import { ReleaseInfo } from "./ReleaseInfo";
import { BanlistInfo } from "./BanlistInfo";
import { CardSetAppearance } from "./CardSetAppearance";
import { CardImage } from "./CardImage";
import { CardPrices } from "./CardPrices";
interface Card {
    readonly id: number;
    readonly name: string;
    readonly desc: string;
    readonly type: string;
    readonly race: string;
    readonly attribute: string | null;
    readonly atk: number | null;
    readonly def: number | null;
    readonly level: number | null;
    readonly scale: number | null;
    readonly linkval: number | null;
    readonly linkmarkers: string[] | null;
    readonly sets: CardSetAppearance[];
    readonly image: CardImage | null;
    readonly prices: CardPrices | null;
    readonly betaName: string | null;
    readonly treatedAs: string | null;
    readonly archetype: string | null;
    readonly formats: string[];
    readonly release: ReleaseInfo;
    readonly banlist: BanlistInfo;
    readonly views: number;
}
export { Card };
//# sourceMappingURL=Card.d.ts.map