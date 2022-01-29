import "reflect-metadata";

import { createLocalVue, shallowMount } from "@vue/test-utils";
import YgoCard from "../../../../src/application/components/YgoCard.vue";
import type { Card } from "@yugioh-deck-tool/core";
import { createCard } from "../../helper/dataFactories";
import VueCompositionApi from "@vue/composition-api";

describe("YgoCard.vue", () => {
	it("binds card name", () => {
		const card: Card = createCard({ passcode: "123", name: "foo" });

		const localVue = createLocalVue();
		localVue.use(VueCompositionApi);
		const wrapper = shallowMount(YgoCard, {
			localVue,
			propsData: { card },
		});

		expect(wrapper.attributes()["data-name"]).toEqual("foo");
	});
});
