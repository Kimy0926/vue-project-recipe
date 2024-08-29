<script setup>
import router from '@/router';
import axios from 'axios';
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';

const form = reactive({
  userName: '',
  passwordHash: '',
  email: '',
});

const toast = useToast();

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const handleSignIn = async () => {
  const newUser = {
    userName: form.userName,
    passwordHash: form.passwordHash,
    email: form.email,
  };

  try {
    const response = await axios.post(`${apiBaseUrl}/login`, newUser);
    toast.success('Sign Up Succeeded');
    router.push('/');
  } catch (error) {
    toast.error('Sign Up Failed');
  }
};

</script>

<template>
  <section class="bg-violet-50">
    <div class="container m-auto max-w-2xl py-24">
      <div class="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
        <form @submit.prevent="handleSignIn">
          <h2 class="text-3xl text-center font-semibold mb-6">Sign Up</h2>

          <div class="mb-4">
            <label for="userName" class="block text-gray-700 font-bold mb-2">Name</label>
            <input
              type="userName"
              v-model="form.userName"
              id="userName"
              name="userName"
              class="border rounded w-full py-2 px-3"
              placeholder="Enter your name"
              required
            />
          </div>

          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              v-model="form.email"
              id="email"
              name="email"
              class="border rounded w-full py-2 px-3"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="mb-4">
            <label for="passwordHash" class="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              v-model="form.passwordHash"
              id="passwordHash"
              name="passwordHash"
              class="border rounded w-full py-2 px-3"
              placeholder="Enter your password"
              required
            />
          </div>


          <div class="mb-4 text-center text-red-500" v-if="error">{{ error }}</div>

          <div>
            <button
              class="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>