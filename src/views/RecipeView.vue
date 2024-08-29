<script setup>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import BackButton from '@/components/BackButton.vue';
import { ref, reactive, onMounted } from 'vue';
import { useRoute, RouterLink, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const recipeId = route.params.recipeId;
const selectedItems = ref([]);

const state = reactive({
  recipe: {},
  isLoading: true,
  isEdited: false,
});

const addParameter = async () => {
  const newParameterId = `RP00${state.recipe.recipeParameters.length + 1}`;
      const newParameter = {
        recipeId: state.recipe.recipeId,
        recipeParamId: newParameterId,
        siteId: state.recipe.siteId,
        recipeParamName: `Parameter ${state.recipe.recipeParameters.length + 1}`,
        usl: 0,
        lsl: 0,
        target: 0
      };
      state.recipe.recipeParameters.push(newParameter);
}

const removeParameter = async (index) => {
  state.recipe.recipeParameters.splice(index, 1);
}

const editParameter = async () => {
  state.isEdited = true;
}

const cancelEditParameter = async () => {
  state.isEdited = false;
}

const toggleSelection = (equipmentId) => {
  const index = selectedItems.value.indexOf(equipmentId);
  if (index > -1) {
    // If the equipment is already selected, remove it
    selectedItems.value.splice(index, 1);
  } else {
    // Otherwise, add it to the selected items
    selectedItems.value.push(equipmentId);
  }
};

const isSelected = (equipmentId) => {
  console.log('isSelected called with:', equipmentId);
  return selectedItems.value.includes(equipmentId);
}



const saveChanges = async () => {
  console.log("Updated Recipe Parameters:", state.recipe);

  try {
    const response = await axios.put(`${apiBaseUrl}/recipes/${state.recipe.recipeId}`, state.recipe);
    toast.success('Recipe Updated Successfully');
    cancelEditParameter();
    router.push(`/recipes/${response.data.recipeId}`);
  } catch (error) {
    toast.error('Failed to Update Recipe')
  }
}

const deleteRecipe = async () => {
  try {
    const confirm = window.confirm('Are you sure you want to delete this recipe?');
    if (confirm) {
      await axios.delete(`${apiBaseUrl}/recipes/${recipeId}`);
      toast.success('Job Deleted Successfully');
      router.push('/recipes');
    }
  } catch (error) {
    console.error('Error deleting recipe', error);
    toast.error('Recipe Not Deleted');
  }
};

const downloadRecipe = async () => {
  await axios.put(`${apiBaseUrl}/kafka/download/${recipeId}`);
}

onMounted(async () => {
  try {
    const response = await axios.get(`${apiBaseUrl}/recipes/${recipeId}`);
    state.recipe = response.data;
    selectedItems.value = state.recipe.equipmentRecipeMap.map(item => item.equipmentId);
  } catch (error) {
    console.error('Error fetching recipe', error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <BackButton />
  <section v-if="!state.isLoading" class="bg-violet-50">
    <div class="container m-auto py-10 px-6">
      <div class="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
        <main>
          <div
            class="bg-white p-6 rounded-lg shadow-md text-center md:text-left"
          >
            <div class="text-gray-500 mb-4">{{ state.recipe.recipeName }}</div>
            <h1 class="text-3xl font-bold mb-4">{{ state.recipe.description }}</h1>
            <div
              class="text-gray-500 mb-4 flex align-middle justify-center md:justify-start"
            >
              <i class="pi pi-map-marker text-xl text-orange-700 mr-2"></i>
              <p class="text-orange-700">{{ state.recipe.siteId }}</p>
            </div>
          </div>

          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-violet-800 text-lg font-bold mb-6">
              Recipe Parameter
            </h3>
            <div class="container mx-auto p-4">
              <table class="min-w-full bg-white border">
                <thead>
                  <tr class="w-full bg-gray-100 text-left">
                    <th class="px-6 py-2 border-r">Parameter Name</th>
                    <th class="px-6 py-2 border-r text-center">USL</th>
                    <th class="px-6 py-2 border-r text-center">LSL</th>
                    <th class="px-6 py-2 text-center">Target</th>
                  </tr>
                </thead>
                <tbody v-if="!state.isEdited">
                  <tr v-for="(param) in state.recipe.recipeParameters" :key="param.recipeParamId" class="bg-white border-b">
                    <td class="px-6 py-4 border-r w-24">{{ param.recipeParamName }}</td>
                    <td class="px-6 py-4 border-r text-center w-24">{{ param.usl }}</td>
                    <td class="px-6 py-4 border-r text-center w-24">{{ param.lsl }}</td>
                    <td class="px-6 py-4 w-24 text-center">{{ param.target }}</td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr v-for="(param, index) in state.recipe.recipeParameters" :key="param.recipeParamId" class="bg-white border-b">
                    <td class="px-6 py-4 border-r relative">
                      <input type="text" v-model="param.recipeParamName" class="w-full px-2 py-1 border rounded" />
                      <button @click="removeParameter(index)" class="absolute right-2 top-2 text-red-500 hover:text-red-700">
                        &times;
                      </button>
                    </td>

                    <td class="px-6 py-4 border-r w-56">
                      <input type="number" v-model="param.usl" class="w-full px-2 py-1 text-center border rounded" />
                    </td>
                    <td class="px-6 py-4 border-r w-56">
                      <input type="number" v-model="param.lsl" class="w-full px-2 py-1 text-center border rounded" />
                    </td>
                    <td class="px-6 py-4 w-56">
                      <input type="number" v-model="param.target" class="w-full px-2 py-1 text-center border rounded" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="!state.isEdited">
                <button @click="editParameter" class="mt-4 px-4 py-2 bg-violet-500 text-white rounded">Edit Parameter</button>
              </div>
              <div v-else>
                <button @click="cancelEditParameter" class="mt-4 px-4 py-2 bg-red-500 text-white rounded">Cancel Edit</button>
                <button @click="addParameter" class="mt-4 ml-4 px-4 py-2 bg-green-500 text-white rounded">Add Parameter</button>
                <button @click="saveChanges" class="mt-4 ml-4 px-4 py-2 bg-blue-500 text-white rounded">Save Parameter</button>
              </div>
            </div>

          </div>
        </main>

        <!-- Sidebar -->
        <aside>
          <!-- Equipment Info -->
          <div class="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h3 class="text-xl font-bold mb-6">Equipment List</h3>
            <ul class="space-y-2">
              <li v-for="eqp in state.recipe.equipmentRecipeMap" :key="eqp.equipmentId" class="flex items-center">
                <button 
                  @click="toggleSelection(eqp.equipmentId)"
                  :class="{
                    'bg-violet-500 text-white': isSelected(eqp.equipmentId),
                    'bg-gray-200 text-gray-800': !isSelected(eqp.equipmentId)
                  }"
                  class="w-full text-left px-4 py-2 rounded-lg focus:outline-none"
                >
                  {{ eqp.equipmentId }}
                </button>
              </li>
            </ul>

            <button
              @click="downloadRecipe"
              class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
            >
            Download Recipe
            </button>
          </div>

          <!-- Manage Recipe -->
          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-xl font-bold mb-6">Manage Recipe</h3>
            <RouterLink
              :to="`/recipes/edit/${state.recipe.recipeId}`"
              class="bg-amber-500 hover:bg-amber-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
              >Edit Recipe</RouterLink
            >
            <button
              @click="deleteRecipe"
              class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
            >
            Delete Recipe
            </button>
          </div>
        </aside>
        <!-- Sidebar -->
      </div>
    </div>
  </section>

  <div v-else class="text-center text-gray-500 py-6">
    <PulseLoader />
  </div>
</template>
