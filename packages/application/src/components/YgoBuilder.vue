<template>
    <div class="builder">
        <YgoFilter :show-advanced="true" v-model="reactiveFilter" />
        <hr />
        <small class="builder__count">
            Showing {{ filteredCards.length }} of {{ formatCards.length }} Cards
        </small>
        <YgoSortingOptions v-model="reactiveSortingOptions" />
        <ol class="builder__matches" v-if="filteredCards.length > 0">
            <li
                :key="card.passcode"
                class="builder__match"
                v-for="card in filteredCards"
            >
                <YgoCard
                    :card="card"
                    :scale-vertically="true"
                    class="builder__match__card"
                ></YgoCard>
                <div class="builder__match__details">
                    <span>{{ card.name }}</span>
                </div>
            </li>
        </ol>
        <div class="builder__no-matches" v-if="filteredCards.length === 0">
            No matches found.
        </div>
    </div>

    <!--        &lt;!&ndash; builder-list &ndash;&gt;-->
    <!--        <template v-if="filteredCards.length">-->
    <!--            <ul class="builder-list">-->
    <!--                <li :key="card.id" v-for="card in filteredCards">-->
    <!--                    <div class="builder-card">-->
    <!--                        &lt;!&ndash; Has to be an anchor tag because of how ygoprodeck.com's tooltip script works &ndash;&gt;-->
    <!--                        <a :data-name="card.name" class="builder-card-name">{{-->
    <!--                            card.name-->
    <!--                        }}</a>-->
    <!--                        <div class="builder-card-action">-->
    <!--                            <button-->
    <!--                                :class="`builder-add-${deckPart.id}`"-->
    <!--                                :disabled="-->
    <!--                                    !canAdd(deckPart, card, filter.format)-->
    <!--                                "-->
    <!--                                :key="deckPart.id"-->
    <!--                                :title="`Add Card to ${deckPart.name} Deck`"-->
    <!--                                @click="(e) => onAddCard(e, deckPart, card)"-->
    <!--                                class="builder-add btn"-->
    <!--                                v-for="deckPart in deckParts"-->
    <!--                            >-->
    <!--                                <span class="fas fa-plus">-->
    <!--                                    &lt;!&ndash;&ndash;&gt;-->
    <!--                                </span>-->
    <!--                            </button>-->
    <!--                        </div>-->
    <!--                    </div>-->
    <!--                </li>-->
    <!--            </ul>-->
    <!--        </template>-->
    <!--        <template v-else>-->
    <!--            <p class="builder-noresults">-->
    <!--                No Results Found-->
    <!--            </p>-->
    <!--        </template>-->
    <!--    </div>-->
</template>

<script lang="ts">
import { applicationContainer } from "../inversify.config";
import { APPLICATION_TYPES } from "../types";
import {
    Card,
    CardDatabase,
    CardFilter,
    CardService,
    DeckService,
    FilterService,
    Format,
    SortingOptions,
    SortingOrder,
    SortingService,
    SortingStrategy,
} from "yugioh-deck-tool-core/src/main";
import YgoFilter from "./YgoFilter.vue";
import YgoSortingOptions from "./YgoSortingOptions.vue";
import { computed, defineComponent, ref } from "@vue/composition-api";
import YgoCard from "@/components/YgoCard.vue";
import { merge } from "lodash";

const cardDatabase = applicationContainer.get<CardDatabase>(
    APPLICATION_TYPES.CardDatabase
);
const sortingService = applicationContainer.get<SortingService>(
    APPLICATION_TYPES.SortingService
);
const filterService = applicationContainer.get<FilterService>(
    APPLICATION_TYPES.FilterService
);
const cardService = applicationContainer.get<CardService>(
    APPLICATION_TYPES.CardService
);
const deckService = applicationContainer.get<DeckService>(
    APPLICATION_TYPES.DeckService
);

export default defineComponent({
    props: {},
    components: {
        YgoCard,
        YgoFilter,
        YgoSortingOptions,
    },
    setup(props, context) {
        const CARD_DISPLAY_LIMIT = 100;

        const reactiveFilter = ref<CardFilter>({
            name: null,

            typeGroup: null,
            type: null,

            subType: null,
            attribute: null,
            level: null,
            linkMarker: null,
            archetype: null,

            format: null,
            banState: null,

            sets: [],
        });
        const reactiveSortingOptions = ref<SortingOptions>({
            strategy: SortingStrategy.NAME,
            order: SortingOrder.DESC,
        });

        const format = computed<Format>(
            () => context.root.$store.state.format.active
        );
        const formatCards = computed<Card[]>(() =>
            filterService.filter(
                cardService.getUniqueByName(cardDatabase.getCards()),
                { format: format.value }
            )
        );
        const filteredCards = computed<Card[]>(() => {
            const filtered = filterService.filter(
                formatCards.value,
                merge(reactiveFilter.value, {
                    format: format.value,
                })
            );
            const sorted = sortingService.sort(
                filtered,
                reactiveSortingOptions.value
            );
            return sorted.slice(0, CARD_DISPLAY_LIMIT);
        });

        //const optionsChanged = () => context.emit("change", reactiveOptions);

        return {
            reactiveFilter,
            reactiveSortingOptions,

            formatCards,
            filteredCards,
        };
    },
});
</script>

<style lang="scss">
@import "~yugioh-deck-tool-ui/src/styles/variables";
@import "~yugioh-deck-tool-ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__modal {
    .builder {
        &__count {
            margin-bottom: 0.5rem;
            display: inline-block;
        }

        &__no-matches {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            text-align: center;
            color: $gray-600;
        }

        &__matches {
            overflow-y: scroll;
            max-height: 50rem;
            margin: 0;
            padding: 0;
            list-style: none;
            border: 1px solid $gray-400;
        }

        &__match {
            display: flex;
            padding: 0.35rem;

            &__card {
                height: 5rem;
            }

            &__details {
                padding-left: 0.35rem;
            }

            &:not(:last-child) {
                border-bottom: 1px solid $gray-400;
            }
        }
    }
}
</style>
