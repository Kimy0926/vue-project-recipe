<script setup>
import { defineProps, computed , ref, reactive } from 'vue';
import router from '@/router';
import axios from 'axios';
import { getRecipes } from '../composables/useRecipes';

defineProps({
  searchBar: Number,
  title: {
    type: String,
    default: 'Recipe Management System',
  }
});

const searchQuery = ref('');

const state = getRecipes();

const activeSuggestionIndex = ref(-1);

const recipeMap = computed(() => {
  return state.recipes.reduce((map, recipe) => {
    map[recipe.recipeId] = recipe.recipeName;
    return map;
  }, {});
});

const handleSearch = () => {
  if (!searchQuery.value) {
    return;
  }

  const recipeId = Object.keys(recipeMap.value).find(
    key => recipeMap.value[key].toLowerCase() === searchQuery.value.toLowerCase()
  );

  if (recipeId) {
    router.push(`/recipes/${recipeId}`);
  } else {
    router.push(`/not-found/${searchQuery.value}`);
  }
};

const filteredSuggestions = computed(() => {
  if (!searchQuery.value) {
    return [];
  }
  return Object.values(recipeMap.value).filter((name) =>
    name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const onKeyDown = (event) => {
  if (event.key === 'ArrowDown') {
    activeSuggestionIndex.value = (activeSuggestionIndex.value + 1) % filteredSuggestions.value.length;
  } else if (event.key === 'ArrowUp') {
    activeSuggestionIndex.value = (activeSuggestionIndex.value - 1 + filteredSuggestions.value.length) % filteredSuggestions.value.length;
  } else if (event.key === 'Enter' && activeSuggestionIndex.value !== -1) {
    selectSuggestion(filteredSuggestions.value[activeSuggestionIndex.value]);
  } else if (event.key === 'Enter' && activeSuggestionIndex.value === -1) {
    handleSearch();
  }
};

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion;
  handleSearch();
  activeSuggestionIndex.value = -1; 
};
</script>

<template>
  <section class="bg-violet-400 py-20 mb-4">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
    >
      <div class="text-center">
        <h1 class="text-xl font-extrabold text-white sm:text-5xl md:text-5xl">
          {{ title }}
        </h1>
      </div>
      <div class="mt-8 w-full max-w-2xl max-h-max relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search recipe name..."
          class="w-full px-4 py-5 pr-12 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-600"
          @keydown="onKeyDown"
        />
        <button
          @click="handleSearch"
          class="absolute right-2 top-2 bottom-2 px-4 bg-violet-600 text-white rounded-full hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
        >
          <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
          <span class="sr-only">Search</span>
        </button>
        <!-- Autocomplete Dropdown -->
        <ul v-if="filteredSuggestions.length" class="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <li
            v-for="(suggestion, index) in filteredSuggestions.slice(0, searchBar || filteredSuggestions.length)"
            :key="index"
            :class="{
              'bg-violet-100 text-violet-800': index === activeSuggestionIndex,
              'cursor-pointer': true
            }"
            @click="selectSuggestion(suggestion)"
            class="px-4 py-2"
          >
            {{ suggestion }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
