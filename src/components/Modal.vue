<script setup>
import { defineProps, defineEmits } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
}

const routeToSignUp = () => {
  closeModal();
  router.push('/signup');
}
</script>


<template>
    <div class="fixed inset-0 flex items-center bg-opacity-50 justify-center z-50" @click="closeModal" v-if="visible">
      <div class="fixed inset-0 bg-black opacity-50"></div>
      <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full" @click.stop>
        <div class="p-6">
          <slot></slot>
        </div>
        <div class="px-6 py-4 bg-gray-100 text-right">
          <button @click="routeToSignUp" class="bg-blue-500 hover:bg-blue-700 mr-4 text-white font-bold py-2 px-4 rounded">
            Sign Up
          </button>
          <button @click="closeModal" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  </template>
  
