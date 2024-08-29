<script setup>
import Navbar from '@/components/Navbar.vue';
import Login from '@/views/LoginView.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <Navbar />
  <RouterView />
  <Login />
</template>
