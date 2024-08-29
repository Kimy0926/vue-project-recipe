<script setup>
import router from '@/router';
import axios from 'axios';
import { reactive } from 'vue';
import { useToast } from 'vue-toastification';
import Modal from '@/components/Modal.vue';
import { doLogin, isLoginModalVisible, hideLoginModal } from '@/eventBus';

const form = reactive({
  email: '',
  password: '',
  error: '',
});

const toast = useToast();

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const closeModal = () => {
  hideLoginModal();
};


const handleLogin = async () => {
  const login = {
    email: form.email,
    password: form.password,
  };

  try {
    const response = await axios.post(`${apiBaseUrl}/login`, login);
    localStorage.setItem('token', response.data.token);
    doLogin();
    toast.success('Login Succeeded');
    hideLoginModal();
    router.push('/');
  } catch (error) {
    toast.error('Login failed');
  }
};

</script>

<template>
  <Modal :visible="isLoginModalVisible" @close="closeModal">
    <form @submit.prevent="handleLogin">
      <h2 class="text-3xl text-center font-semibold mb-6">Login</h2>

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
        <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
        <input
          type="password"
          v-model="form.password"
          id="password"
          name="password"
          class="border rounded w-full py-2 px-3"
          placeholder="Enter your password"
          required autocomplete="current-password"
        />
      </div>

      <div class="mb-4 text-center text-red-500" v-if="form.error">{{ error }}</div>

      <div>
        <button
          type="submit"
          class="bg-violet-500 hover:bg-violet-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
        >
          Login
        </button>
      </div>
    </form>
    
  </Modal>
</template>
