import { reactive, onMounted } from 'vue';
import axios from 'axios';

export function getRecipes() {
  const state = reactive({
    recipes: [],
    isLoading: true,
  });

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  onMounted(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/recipes`);
      state.recipes = response.data;
    } catch (error) {
      console.error('Error fetching recipes', error);
    } finally {
      state.isLoading = false;
    }
  });

  return state;
}