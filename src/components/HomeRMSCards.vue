<script setup>
import { RouterLink } from 'vue-router';
import Card from '@/components/Card.vue';
</script>

<template>
  <section class="py-4">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
        <Card>
          <h2 class="text-2xl font-bold mb-3">Match Recipe</h2>
          <RouterLink
            to="/recipes/map"
            class="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
          >
          Match Recipe
          </RouterLink>
        </Card>
        <Card bg="bg-violet-100">
          <h2 class="text-2xl font-bold mb-3">Create New Recipe</h2>
          <RouterLink
            to="/recipes/add"
            class="inline-block bg-violet-500 text-white rounded-lg px-4 py-2 hover:bg-violet-600"
          >
          Create Recipe
          </RouterLink>
        </Card>
      </div>
    </div>
  </section>
</template>
