import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import AddRecipeView from '@/views/AddRecipeView.vue';
import SignUpView from '@/views/SignUpView.vue';
import RecipesView from '@/views/RecipesView.vue';
import RecipeView from '@/views/RecipeView.vue';
import EditRecipeView from '@/views/EditRecipeView.vue';
import MappingRecipeView from '@/views/MappingRecipe.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/recipes',
      name: 'recipes',
      component: RecipesView,
    },
    {
      path: '/recipes/:recipeId',
      name: 'recipe',
      component: RecipeView,
    },
    {
      path: '/recipes/add',
      name: 'add-recipe',
      component: AddRecipeView,
    },
    {
      path: '/recipes/map',
      name: 'map-recipe',
      component: MappingRecipeView,
    },
    {
      path: '/recipes/edit/:id',
      name: 'edit-job',
      component: EditRecipeView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

export default router;
