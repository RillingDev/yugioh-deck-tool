import "reflect-metadata";
import {
    BanlistService,
    container,
    DefaultBanState,
    Format,
    TYPES,
} from "../../../../src/main";
import { createCard } from "../../../helper/dataFactories";

describe("BanlistService", () => {
    let banlistService: BanlistService;

    beforeEach(() => {
        container.snapshot();

        banlistService = container.get<BanlistService>(TYPES.BanlistService);
    });

    afterEach(() => {
        container.restore();
    });

    describe("getBanStateByFormat", () => {
        it("returns UNLIMITED if format is null", () => {
            expect(
                banlistService.getBanStateByFormat(
                    createCard({ passcode: "123" }),
                    null
                )
            ).toBe(DefaultBanState.UNLIMITED);
        });

        it("returns BANNED if the format is not listed for this card", () => {
            expect(
                banlistService.getBanStateByFormat(
                    createCard({ passcode: "123", formats: [Format.GOAT] }),
                    Format.RUSH_DUEL
                )
            ).toBe(DefaultBanState.BANNED);
        });

        it("returns UNLIMITED if the format has no banlist", () => {
            expect(
                banlistService.getBanStateByFormat(
                    createCard({
                        passcode: "123",
                        formats: [Format.RUSH_DUEL],
                        banlist: {
                            [Format.TCG]: DefaultBanState.LIMITED,
                            [Format.OCG]: DefaultBanState.LIMITED,
                            [Format.GOAT]: DefaultBanState.LIMITED,
                        },
                    }),
                    Format.RUSH_DUEL
                )
            ).toBe(DefaultBanState.UNLIMITED);
        });

        it("returns banlist if the format has a banlist", () => {
            expect(
                banlistService.getBanStateByFormat(
                    createCard({
                        passcode: "123",
                        formats: [Format.TCG],
                        banlist: {
                            [Format.TCG]: DefaultBanState.LIMITED,
                            [Format.OCG]: DefaultBanState.LIMITED,
                            [Format.GOAT]: DefaultBanState.LIMITED,
                        },
                    }),
                    Format.TCG
                )
            ).toBe(DefaultBanState.LIMITED);
        });
    });
});
