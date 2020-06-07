<template>
    <div class="builder-match">
        <YgoCard
            :card="card"
            :scale-vertically="true"
            class="builder-match__card"
        ></YgoCard>
        <div class="builder-match__details">
            <p>{{ card.name }}</p>
            <p>
                <small>{{ typeText }}</small>
            </p>
            <p>
                <small>{{ subTypeText }}</small>
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import { Card, CardTypeGroup } from "yugioh-deck-tool-core";
import { computed, defineComponent } from "@vue/composition-api";
import YgoCard from "../YgoCard.vue";
import { PropType } from "vue";

export default defineComponent({
    props: {
        card: {
            required: true,
            type: Object as PropType<Card>,
        },
    },
    components: {
        YgoCard,
    },
    setup(props) {
        const typeText = computed<string>(() =>
            props.card.type.group === CardTypeGroup.MONSTER
                ? props.card.type.name
                : props.card.type.group
        );
        const subTypeText = computed<string>(() =>
            props.card.type.group === CardTypeGroup.MONSTER
                ? `${props.card.attribute}/${props.card.subType}`
                : props.card.subType
        );

        return { typeText, subTypeText };
    },
});
</script>

<style lang="scss">
@import "../../../../ui/src/styles/variables";
@import "../../../../ui/src/styles/mixin/screen";

.deck-tool,
.deck-tool__modal {
    .builder-match {
        display: flex;
        padding: 0.35rem;

        &__card {
            height: 5rem;
        }

        &__details {
            padding-left: 0.5rem;

            > p {
                margin-bottom: 0;
            }
        }

        &:not(:last-child) {
            border-bottom: 1px solid $gray-400;
        }
    }
}
</style>
