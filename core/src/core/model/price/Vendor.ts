import { deepFreeze } from "lightdash";

interface Vendor {
    readonly id: string;
    readonly name: string;
}

const DefaultVendor: {
    readonly CARDMARKET: Vendor;
    readonly TCGPLAYER: Vendor;
    readonly COOL_STUFF_INC: Vendor;
} = {
    CARDMARKET: { name: "Cardmarket", id: "cardmarket" },
    TCGPLAYER: { name: "TCGPlayer", id: "tcgplayer" },
    COOL_STUFF_INC: { name: "Cool Stuff Inc.", id: "coolstuffinc" },
};
deepFreeze(DefaultVendor);

export { Vendor, DefaultVendor };
