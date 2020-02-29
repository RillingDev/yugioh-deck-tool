import { YgoprodeckApiService } from "../../../src/api/YgoprodeckApiService";

describe("YgoprodeckClient", () => {
    it("is defined", () => {
        expect(new YgoprodeckApiService()).toBeDefined();
    });
});
