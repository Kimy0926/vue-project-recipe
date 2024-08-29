<script setup>
import { RouterLink } from 'vue-router';
import { defineProps, ref, computed } from 'vue';

const props = defineProps({
  recipe: Object,
});

const showFullDescription = ref(false);

const toggleFullDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};

const truncatedDescription = computed(() => {
  let description = props.recipe.description;
  if (!showFullDescription.value) {
    description = description.substring(0, 90) + '...';
  }
  return description;
});
</script>

<template>
  <div class="bg-white rounded-xl shadow-md relative">
    <div class="p-4">
      <div class="mb-6">
        <div class="text-gray-600 my-2 font-bold">{{ recipe.recipeName }}</div>
      </div>

      <div class="mb-5">
        <div>
          {{ truncatedDescription }}
        </div>
        <button
          @click="toggleFullDescription"
          class="text-violet-500 hover:text-violet-600 mb-5"
        >
          {{ showFullDescription ? 'Less' : 'More' }}
        </button>
      </div>

      <div class="border border-gray-100 mb-5"></div>

      <div class="flex flex-col lg:flex-row justify-between mb-4">
        <div class="text-orange-700 mb-3">
          <i class="pi pi-map-marker text-orange-700"></i>
          {{ recipe.siteId }}
        </div>
        <RouterLink
          :to="'/recipes/' + recipe.recipeId"
          class="h-[36px] bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 rounded-lg text-center text-sm"
        >
          View Recipe
        </RouterLink>
      </div>
    </div>
  </div>
</template>
