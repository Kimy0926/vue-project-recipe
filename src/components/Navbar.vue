<script setup>
import { RouterLink, useRoute } from 'vue-router';
import logo from '@/assets/img/logo.png';
import { showLoginModal } from '@/eventBus';
import { isLoggedin } from '@/eventBus';


const isActiveLink = (routePath) => {
  const route = useRoute();
  return route.path === routePath;
};

const handleLoginClick = (event) => {
  event.preventDefault();
  showLoginModal();
};
</script>

<template>
  <nav class="bg-violet-500 border-b border-violet-500">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="flex h-20 items-center justify-between">
        <div
          class="flex flex-1 items-center justify-center md:items-stretch md:justify-start"
        >
          <!-- Logo -->
          <RouterLink class="flex flex-shrink-0 items-center mr-4" to="/">
            <img class="h-10 w-auto" :src="logo" alt="Vue Jobs" />
            <span class="hidden md:block text-white text-2xl font-bold ml-2"
              >Vue Recipe</span
            >
          </RouterLink>
          <div class="md:ml-auto">
            <div class="flex space-x-2">
              <RouterLink
                to="/"
                :class="[
                  isActiveLink('/')
                    ? 'bg-violet-900'
                    : 'hover:bg-violet-900 hover:text-white',
                  'text-white',
                  'px-3',
                  'py-2',
                  'rounded-md',
                ]"
                >Home</RouterLink
              >
              <RouterLink
                to="/recipes"
                :class="[
                  isActiveLink('/recipes')
                    ? 'bg-violet-900'
                    : 'hover:bg-violet-900 hover:text-white',
                  'text-white',
                  'px-3',
                  'py-2',
                  'rounded-md',
                ]"
                >Recipes</RouterLink
              >

              <a v-if="!isLoggedin"
                href="#"
                @click="handleLoginClick"
                class="text-white px-3 py-2 rounded-md hover:bg-violet-900 hover:text-white"
              >
                Login
              </a>
              <span v-else class="text-white px-3 py-2 rounded-md">
                Welcome, Member!
              </span>

            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
