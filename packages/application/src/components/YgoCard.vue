<template>
    <a :data-name="name" @contextmenu="(e) => onCardRightClick(e)" class="card">
        <img :alt="name" :src="imgSrc" class="card__img" />
    </a>
</template>

<script lang="ts">
import { Card } from "yugioh-deck-tool-core/src/main";
import { PropType } from "vue";
import { computed, defineComponent } from "@vue/composition-api";

export default defineComponent({
    props: {
        card: {
            required: true,
            type: Object as PropType<Card>,
        },
    },
    setup(props, context) {
        const name = computed(() => props.card.name);
        const imgSrc = computed(() => props.card.image.urlSmall);
        const onRightClick = (e: Event) => {
            e.preventDefault();
            context.emit("right-click", null);
        };

        return { name, imgSrc, onCardRightClick: onRightClick };
    },
});
</script>

<style lang="scss" scoped>
.card {
    display: inline-block; // Make sure link covers full card
    min-width: 50px;
    max-width: 100px;
}

.card__img {
    pointer-events: none; // Allow "clicking through" to parent link.
    width: 100%;
    height: auto;
}
</style>
