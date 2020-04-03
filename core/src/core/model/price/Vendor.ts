import { deepFreeze } from "../../business/deepFreeze";

interface Vendor {
    readonly id: string;
    readonly name: string;
}

const DefaultVendor: {
    readonly CARDMARKET: Vendor;
    readonly TCGPLAYER: Vendor;
    readonly COOL_STUFF_INC: Vendor;
    readonly EBAY: Vendor;
    readonly AMAZON: Vendor;
} = {
    CARDMARKET: { name: "Cardmarket", id: "cardmarket" },
    TCGPLAYER: { name: "TCGPlayer", id: "tcgplayer" },
    COOL_STUFF_INC: { name: "Cool Stuff Inc.", id: "coolstuffinc" },
    EBAY: { name: "eBay", id: "ebay" },
    AMAZON: { name: "Amazon", id: "amazon" },
};
deepFreeze(DefaultVendor);

export { Vendor, DefaultVendor };
