<template>
    <div class="draw-sim">
        <button
            class="btn btn-primary btn-sm"
            @click="() => showModal()"
            :disabled="!hasMainDeckCards"
        >
            Simulate Start-Hand
        </button>

        <BModal
            hide-footer
            modal-class="deck-tool__modal"
            body-class="draw-sim__modal"
            ref="modal"
            size="lg"
            title="Start-Hand Simulation"
        >
            <div class="btn-group" role="group">
                <button
                    :class="{ active: goingFirst }"
                    class="btn btn-primary"
                    @click="() => setGoingFirst(true)"
                >
                    Going First
                </button>
                <button
                    :class="{ active: !goingFirst }"
                    class="btn btn-primary"
                    @click="() => setGoingFirst(false)"
                >
                    Going Second
                </button>
            </div>
            <div class="draw-sim__output">
                <YgoCard
                    :card="card"
                    v-for="(card, index) of drawnCards"
                    :key="`${index}_${card.passcode}`"
                />
            </div>
            <button class="btn btn-primary" @click="() => draw()">
                Draw
            </button>
        </BModal>
    </div>
</template>

<script lang="ts">
import YgoCard from "../YgoCard.vue";
import { Card, Deck, DeckPart, DeckService } from "../../../../core/src/main";
import { BModal } from "bootstrap-vue";
import { applicationContainer } from "../../inversify.config";
import { APPLICATION_TYPES } from "../../types";
import { computed, defineComponent, ref } from "@vue/composition-api";

const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);

export default defineComponent({
    components: {
        YgoCard,
        BModal,
    },
    props: {},
    setup(props, context) {
        const goingFirst = ref<boolean>(true);
        const drawnCards = ref<Card[]>([]);
        const modal = ref<BModal>();

        const deck = computed<Deck>(
            () => context.root.$store.state.deck.active
        );
        const hasMainDeckCards = computed<boolean>(
            () => deck.value.parts[DeckPart.MAIN].length > 0
        );

        const draw = (): void => {
            drawnCards.value = deckService.getSimulatedStartingHand(
                deck.value,
                goingFirst.value
            );
        };
        const showModal = (): void => {
            modal.value?.show();
            draw();
        };
        const setGoingFirst = (val: boolean): void => {
            goingFirst.value = val;
            draw();
        };

        return {
            modal,
            goingFirst,
            hasMainDeckCards,
            drawnCards,
            setGoingFirst,
            showModal,
            draw,
        };
    },
});
</script>

<style lang="scss">
@import "../../../../ui/src/styles/variables";
@import "../../../../ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__modal {
    /*.draw-sim__modal {*/
    /*}*/

    /*.draw-sim__output {*/
    /*    display: grid;*/
    /*    padding: 0.35rem;*/
    /*    gap: 0.35rem;*/
    /*    grid-template-columns: repeat(auto-fill, minmax(10ch, 1fr));*/
    /*}*/
}
</style>
