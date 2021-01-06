import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "../../../src/types";
import { baseModule } from "../../../src/inversify.config";
import type { PriceService } from "../../../src/core/price/PriceService";
import { createCard } from "../../helper/dataFactories";
import type { Vendor } from "../../../src/core/price/Vendor";
import { DefaultVendor } from "../../../src/core/price/Vendor";
import { DefaultCurrency } from "../../../src/core/price/Currency";

describe("PriceService", () => {
    let priceService: PriceService;

    beforeEach(() => {
        const container = new Container();
        container.load(baseModule);

        priceService = container.get<PriceService>(TYPES.PriceService);
    });

    describe("formatPrice", () => {
        it("formats", () => {
            expect(
                priceService.formatPrice(10.1234, DefaultCurrency.USD)
            ).toEqual("$10.12");
        });
    });

    describe("getPrice", () => {
        it("excludes without data", () => {
            const card1 = createCard({
                passcode: "123",
                prices: new Map<Vendor, number>([
                    [DefaultVendor.COOL_STUFF_INC, 1000],
                ]),
            });
            expect(
                priceService.getPrice(
                    [card1],
                    DefaultVendor.TCG_PLAYER,
                    DefaultCurrency.USD
                )
            ).toEqual({
                price: 0,
                missing: [card1],
            });
        });

        it("uses price for vendor", () => {
            const card1 = createCard({
                passcode: "123",
                prices: new Map<Vendor, number>([
                    [DefaultVendor.TCG_PLAYER, 999],
                    [DefaultVendor.COOL_STUFF_INC, 1000],
                ]),
            });
            expect(
                priceService.getPrice(
                    [card1],
                    DefaultVendor.COOL_STUFF_INC,
                    DefaultCurrency.USD
                )
            ).toEqual({
                price: 1000,
                missing: [],
            });
        });

        it("converts based on requested currency", () => {
            const card1 = createCard({
                passcode: "123",
                prices: new Map<Vendor, number>([
                    [DefaultVendor.TCG_PLAYER, 1000], // USD currency
                ]),
            });
            expect(
                priceService.getPrice([card1], DefaultVendor.TCG_PLAYER, {
                    id: "WTF",
                    name: "???",
                    conversionRate: 0.5,
                    fractionDigits: 2,
                })
            ).toEqual({
                price: 500,
                missing: [],
            });
        });

        it("works with non-USD vendor", () => {
            const someVendor = {
                name: "Some Store",
                id: "somestore",
                currency: {
                    id: "WTF",
                    name: "???",
                    conversionRate: 0.5,
                    fractionDigits: 2,
                },
            };
            const card1 = createCard({
                passcode: "123",
                prices: new Map<Vendor, number>([[someVendor, 500]]),
            });
            expect(
                priceService.getPrice([card1], someVendor, DefaultCurrency.USD)
            ).toEqual({
                price: 1000,
                missing: [],
            });
        });

        it("defaults to vendor currency", () => {
            const someVendor = {
                name: "Some Store",
                id: "somestore",
                currency: {
                    id: "WTF",
                    name: "???",
                    conversionRate: 0.5,
                    fractionDigits: 2,
                },
            };
            const card1 = createCard({
                passcode: "123",
                prices: new Map<Vendor, number>([[someVendor, 500]]),
            });
            expect(priceService.getPrice([card1], someVendor, null)).toEqual({
                price: 500,
                missing: [],
            });
        });

        it("returns sum of prices", () => {
            const card1 = createCard({
                passcode: "123",
                prices: new Map<Vendor, number>([
                    [DefaultVendor.TCG_PLAYER, 500],
                ]),
            });
            const card2 = createCard({
                passcode: "456",
                prices: new Map<Vendor, number>([
                    [DefaultVendor.TCG_PLAYER, 100],
                ]),
            });
            const card3 = createCard({
                passcode: "789",
                prices: new Map<Vendor, number>([]),
            });
            expect(
                priceService.getPrice(
                    [card1, card1, card2, card3],
                    DefaultVendor.TCG_PLAYER,
                    null
                )
            ).toEqual({
                price: 1100,
                missing: [card3],
            });
        });
    });
});
