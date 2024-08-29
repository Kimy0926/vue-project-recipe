<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <section>
    <div class="container m-auto py-6 px-6">
      <RouterLink
        to="/recipes"
        class="text-violet-500 hover:text-violet-700 flex items-center"
      >
        <i class="pi pi-arrow-circle-left mr-3"></i> Back to Recipe List
      </RouterLink>
    </div>
  </section>
</template>
