<script setup>
import axios from 'axios';
import { reactive, onMounted, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

const state = reactive({
  recipes: {},
  site: {},
  equipment: {},
  currentMappings: {},
  isLoading: true,
});

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const toast = useToast();

const selectedRecipe = ref(null);
const selectedSite = ref(null);
const filterdRecipe = ref([]);
const selectedEquipmentIds = ref([]);

// const setSelectedEquipment = (equipmentId) => {
//     const index = selectedEquipment.value.indexOf(equipmentId);
//     if (index > -1) {
//         selectedEquipment.value.splice(index, 1);    
//     } else {
//         selectedEquipment.value.push(equipmentId);
//     }
    
// }

// const setSelectedRecipe = (recipe) => {
//     selectedRecipe.value = recipe;
// }

// const isSelected = (equipmentId) => {
//   return selectedEquipment.value.includes(equipmentId);
// }

const fetchCurrentMappings = async (recipeId) => {
  try {
    const response = await axios.get(`${apiBaseUrl}/recipes/mappings/${recipeId}`);
    const mappings = response.data.reduce((acc, mapping) => {
      acc[mapping.equipmentId] = mapping;
      return acc;
    }, {});
    state.currentMappings = mappings;
    selectedEquipmentIds.value = Object.keys(mappings);
  } catch (error) {
    console.error('Error fetching current mappings', error);
    state.currentMappings = {};
  }
}

watch(selectedRecipe, (newRecipe) => {
  if (newRecipe && newRecipe.recipeId) {
    fetchCurrentMappings(newRecipe.recipeId);
  } else {
    state.currentMappings = {};
    selectedEquipmentIds.value = [];
  }
});

watch(selectedSite, (siteId) => {
  if (siteId) {
    filterdRecipe.value = Object.entries(state.recipes)
    .filter(([key, value]) => value.siteId === siteId)
    .map(([key, value]) => value);
    console.log(filterdRecipe.value);
  }
});

const mapEquipmentToRecipe = async () => {
    if (!selectedRecipe.value || selectedEquipmentIds.value.length === 0) {
        return;
    }

    const mappingObj = selectedEquipmentIds.value.map((equipmentId) => ({
    RecipeId: selectedRecipe.value.recipeId,
    EquipmentId: equipmentId,
    SiteId: selectedSite.value, 
  }));

    try {
        await axios.post(`${apiBaseUrl}/recipes/mapping`, mappingObj);
        toast.success('Mapping Updated Successfully');
        fetchCurrentMappings(selectedRecipe.value.recipeId)
    } catch (error) {
        console.error('Error mapping equipment to recipe', error);
        toast.error('Mapping Failed');
    }
    
}

onMounted(async () => {
    try {
        const [equipmentResponse, recipeResponse, siteResponse] = await Promise.all([
            axios.get(`${apiBaseUrl}/recipes/equipment`),
            axios.get(`${apiBaseUrl}/recipes`),
            axios.get(`${apiBaseUrl}/recipes/site`)
        ]);
        state.equipment = equipmentResponse.data;
        state.recipes = recipeResponse.data;
        state.site =siteResponse.data;

        // Set selectedSite to the first site in state.site
        if (state.site.length > 0) {
          selectedSite.value = state.site[0];
        }
        
        // Get the first recipe filtered by siteId
        selectedRecipe.value = Object.entries(state.recipes)
          .filter(([key, value]) => value.siteId === selectedSite.value)
          .map(([key, value]) => value)[0] || null;

    } catch (error) {
        console.error('Error while fetching data', error);
    } finally {
      state.isLoading = false;
    }
});
</script>

<template>
  <div class="container mx-auto py-10 px-6">
    <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
      
      <!-- Recipe Info Card -->
      <div class="bg-white p-6 rounded-lg shadow-lg text-center md:text-left">
        <h1 class="text-3xl font-semibold mb-6 text-gray-800">Match Recipe</h1>

        <div class="columns-2 mb-6">
          <!-- Site Selection -->
          <label for="site-select" class="block text-gray-700 font-medium mb-2">Site:</label>
          <select id="site-select" v-model="selectedSite" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option v-for="site in state.site" :value="site" :key="site.siteId">
              {{ site }}
            </option>
          </select>
          <!-- Recipe Selection -->
          <label for="recipe-select" class="block text-gray-700 font-medium mb-2">Recipe:</label>
          <select id="recipe-select" v-model="selectedRecipe" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option v-for="recipe in filterdRecipe" :value="recipe" :key="recipe.recipeId">
              {{ recipe.recipeName }}
            </option>
          </select>
        </div>
      </div>

      <!-- Equipment and Mapping Action -->
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <!-- Equipment Selection -->
        <h3 class="text-lg font-semibold text-violet-700 mb-4">Equipment List</h3>
        <div class="border border-gray-300 p-4 rounded-lg max-h-72 overflow-y-auto">
          <label v-for="equipment in state.equipment" :key="equipment.equipmentId" class="flex items-center mb-3">
            <input
              type="checkbox"
              :value="equipment.equipmentId"
              v-model="selectedEquipmentIds"
              class="form-checkbox text-indigo-600"
            />
            <span class="ml-2 text-gray-700">{{ equipment.equipmentName }}</span>
          </label>
        </div>

        <!-- Mapping Action -->
        <button
          @click="mapEquipmentToRecipe"
          class="bg-green-600 text-white px-4 py-2 rounded-lg mt-6 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          :disabled="!selectedRecipe || selectedEquipmentIds.length === 0"
        >
          Map Selected Equipment
        </button>
      </div>

    </div>
  </div>
</template>


