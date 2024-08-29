<script setup>
import Hero from '@/components/Hero.vue';
import HomeRMSCards from '@/components/HomeRMSCards.vue';
import RecipeListings from '@/components/RecipeListings.vue';
</script>

<template>
  <Hero :searchBar="5"/>
  <!-- <HomeCards /> -->
  <HomeRMSCards />
  <RecipeListings :limit="3" :showButton="true" />
</template>
