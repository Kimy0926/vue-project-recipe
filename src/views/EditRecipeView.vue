<script setup>
import router from '@/router';
import { reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const route = useRoute();

const recipeId = route.params.id;

const form = reactive({
  recipeId : recipeId,
  recipeName: '',
  siteId: '',
  description: ''
});

const state = reactive({
  recipe: {},
  site: {},
  isLoading: true,
});

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const toast = useToast();

const handleSubmit = async () => {
  const updatedRecipe = {
    recipeId : form.recipeId,
    siteId: form.siteId,
    recipeName: form.recipeName,
    description: form.description
  };

  try {
    const response = await axios.put(`${apiBaseUrl}/recipes/update/${recipeId}`, updatedRecipe);
    toast.success('Recipe Updated Successfully');
    router.push(`/recipes/${response.data.recipeId}`);
  } catch (error) {
    console.error('Error fetching recipe', error);
    toast.error('Recipe Was Not Added');
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/recipes/${recipeId}`);
    state.recipe = response.data;
    const response2 = await axios.get(`${apiBaseUrl}/recipes/site`);
    state.site = response2.data;
    // Populate inputs
    form.recipeName = state.recipe.recipeName;
    form.siteId = state.recipe.siteId;
    form.description = state.recipe.description;
  } catch (error) {
    console.error('Error fetching recipe', error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <section class="bg-violet-50">
    <div class="container m-auto max-w-2xl py-24">
      <div
        class="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0"
      >
        <form @submit.prevent="handleSubmit">
          <h2 class="text-3xl text-center font-semibold mb-6">Edit Recipe</h2>

          <div class="mb-4">
            <label class="block text-gray-700 font-bold mb-2"
              >Recipe Name</label
            >
            <input
              type="text"
              v-model="form.recipeName"
              id="recipeName"
              name="recipeName"
              class="border rounded w-full py-2 px-3 mb-2"
              placeholder="eg. Custom Blend Formula"
              required
            />
          </div>

          <div class="mb-4">
            <label for="siteId" class="block text-gray-700 font-bold mb-2"
              >Site</label
            >
            <select
              id="siteId"
              v-model="form.siteId"
              name="siteId"
              class="border rounded w-full py-2 px-3"
              required
            >
              <option v-for="site in state.site" :key="site" :value="site">
                {{ site }}
              </option>
            </select>
          </div>

          <div class="mb-4">
            <label for="description" class="block text-gray-700 font-bold mb-2"
              >Description</label
            >
            <textarea
              id="description"
              v-model="form.description"
              name="description"
              class="border rounded w-full py-2 px-3"
              rows="4"
              placeholder="Add any job duties, expectations, requirements, etc"
            ></textarea>
          </div>

          <div>
            <button
              class="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Update Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
