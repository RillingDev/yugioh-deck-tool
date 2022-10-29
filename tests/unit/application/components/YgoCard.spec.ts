import "reflect-metadata";

import { createLocalVue, shallowMount } from "@vue/test-utils";
import YgoCard from "../../../../src/application/components/YgoCard.vue";
import type { Card } from "@/core/lib";
import { createCard } from "../../helper/dataFactories";

describe("YgoCard.vue", () => {
	// TODO
	// it("binds card name", () => {
	// 	const card: Card = createCard({ passcode: "123", name: "foo" });
	//
	// 	const localVue = createLocalVue();
	// 	const wrapper = shallowMount(YgoCard, {
	// 		localVue,
	// 		propsData: { card },
	// 	});
	//
	// 	expect(wrapper.attributes()["data-name"]).toEqual("foo");
	// });
});
