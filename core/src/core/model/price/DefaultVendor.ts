import { Vendor } from "./Vendor";

interface DefaultVendors {
    CARDMARKET: Vendor;
    TCGPLAYER: Vendor;
    COOL_STUFF_INC: Vendor;
    EBAY: Vendor;
    AMAZON: Vendor;
}

const DefaultVendor: DefaultVendors = {
    CARDMARKET: { name: "Cardmarket", id: "cardmarket" },
    TCGPLAYER: { name: "TCGPlayer", id: "tcgplayer" },
    COOL_STUFF_INC: { name: "Cool Stuff Inc.", id: "coolstuffinc" },
    EBAY: { name: "eBay", id: "ebay" },
    AMAZON: { name: "Amazon", id: "amazon" }
};

export { DefaultVendor };
