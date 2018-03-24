<template>
    <div class="builder">
        <span>Showing {{ pairsArrFiltered.length }} of {{ pairsArr.length }} Cards</span>

        <ygo-filter
            :pairs-arr="pairsArr"
            v-model="pairsArrFiltered"
        />

        <!-- builder-list -->
        <ul
            v-if="pairsArrFiltered.length"
            class="builder-list"
        >
            <li
                v-for="pair in pairsArrFiltered"
                :key="pair[0]"
            >
                <!-- Has to be an anchor tag because of how ygoprodeck.com's tooltip script works -->
                <a
                    :data-name="pair[1]"
                    class="builder-card"
                >
                    <span class="builder-card-name">{{ pair[1] }}</span>
                    <div class="builder-card-action">
                        <button
                            v-for="deckPart in deckParts"
                            :key="deckPart.id"
                            :class="`builder-add-${deckPart.id}`"
                            :title="`Add Card to ${deckPart.name} Deck`"
                            :disabled="!deckCardCanAdd(deckPart, pair[0],filter.banlist.active)"
                            class="builder-add btn"
                            @click="(e) => clickEvent(e, deckPart, pair[0],filter.banlist.active)"
                        >
                            <span class="fa fa-plus">
                                <!---->
                            </span>
                        </button>
                    </div>
                </a>
            </li>
        </ul>
    </div>
</template>

<script>
import YgoFilter from "./ygoFilter.vue";

export default {
    components: { YgoFilter },
    props: {
        pairsArr: {
            type: Array,
            required: true
        },
        deckCardCanAdd: {
            type: Function,
            required: true
        }
    },
    data: () => {
        return {
            pairsArrFiltered: []
        };
    },
    /*computed: {
        pairsFiltered() {
            return [];  searchCard(
                this.pairsArr,
                this.filter,
                {
                    monster: this.isMonster,
                    monsterLink: this.isMonsterLink,
                    spell: this.isSpell,
                    trap: this.isTrap
                },
                this.sort.active.fn
            ).slice(0, 100);  // Take 100 first results;
        }
    },*/
    methods: {
        clickEvent(e, deckPart, cardId, banlist) {
            this.$emit("deckcardadd", deckPart, cardId, banlist, e);
        }
    }
};
</script>

<style lang="scss">
@import "node_modules/bootstrap/scss/functions";
@import "node_modules/bootstrap/scss/mixins";
@import "node_modules/bootstrap/scss/variables";

@import "../styles/mixins/screen";
@import "../styles/variables.custom";

.builder-list {
    max-height: 250px;
    width: 100%;
    overflow-x: auto;
    overflow-y: scroll;
    list-style: none;
    padding: 0;
    resize: vertical;
    border: 1px solid $gray-400;
    @include screen(min, md) {
        max-height: 60vh;
    }
}

.builder-list li {
    border-top: 1px solid $gray-400;
    &:first-child {
        border-top: 0;
    }
}

.builder-card {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 10px;
}

.builder-card-name {
    padding: 10px 0;
}

.builder-card-action {
    width: 80px;
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
}

.btn.builder-add {
    width: 34px;
    opacity: 0.8;
    font-size: 1.2em;
    cursor: pointer;
    padding: 0;
    background-color: transparent;
    &:active {
        opacity: 1;
    }
    &[disabled] {
        opacity: 0.4;
    }
    &-main .fa {
        color: $color-deckpart-main;
    }
    &-extra .fa {
        color: $color-deckpart-extra;
    }
    &-side .fa {
        color: $color-deckpart-side;
    }
}
</style>
