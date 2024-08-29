<script setup>
import { RouterLink } from 'vue-router';
import RecipeListing from './RecipeListing.vue';
import { reactive, defineProps, onMounted } from 'vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import axios from 'axios';
import { getRecipes } from '../composables/useRecipes';

defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false,
  },
});

const state = getRecipes();

</script>

<template>
  <section class="bg-violet-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-violet-500 mb-6 text-center">
        Recipe List
      </h2>
      <!-- Show loading spinner if loading is true -->
      <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
        <PulseLoader />
      </div>

      <!-- Show recipe listing when done loading -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RecipeListing
          v-for="recipe in state.recipes.slice(0, limit || state.recipes.length)"
          :key="recipe.recipeId"
          :recipe="recipe"
        />
      </div>
    </div>
  </section>

  <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
    <RouterLink
      to="/recipes"
      class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
      >View All Recipe</RouterLink
    >
  </section>
</template>
