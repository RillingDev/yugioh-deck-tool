import { YgoprodeckApiClient } from "../../../src/api/YgoprodeckApiClient";

describe("YgoprodeckClient", () => {
    it("is defined", () => {
        expect(new YgoprodeckApiClient()).toBeDefined();
    });
});
