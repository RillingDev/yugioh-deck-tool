import { YgoprodeckClient } from "../../../src/api/YgoprodeckClient";

describe("YgoprodeckClient", () => {
    it("is defined", () => {
        expect(new YgoprodeckClient()).toBeDefined();
    });
});
