<script setup>
import router from '@/router';
import { reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const form = reactive({
  recipeName: '',
  siteId: '',
  description: ''
});

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const toast = useToast();

const state = reactive({
  site: {},
});

const handleSubmit = async () => {
  const newRecipe = {
    recipeName: form.recipeName,
    siteId: form.siteId,
    description: form.description
  };

  try {
    const response = await axios.post(`${apiBaseUrl}/recipes`, newRecipe);
    toast.success('Recipe Added Successfully');
    router.push(`/recipes/${response.data}`);
  } catch (error) {
    console.error('Error fetching recipe', error);
    toast.error('Recipe Was Not Added');
  }
};

onMounted(async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/recipes/site`);
    state.site = response.data;
  } catch (error) {
    console.error('Error fetching site', error);
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
          <h2 class="text-3xl text-center font-semibold mb-6">Create Recipe</h2>

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
              placeholder="Tailored for specialized production needs, this recipe allows for precise adjustments to ingredient ratios or component settings to create a unique product blend."
            ></textarea>
          </div>

          <div>
            <button
              class="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>
