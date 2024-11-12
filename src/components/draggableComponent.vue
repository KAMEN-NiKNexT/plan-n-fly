<template>
  <v-container>
    <draggable
      v-model="storePlace.places"
      group="people"
      item-key="id"
      @start="drag = true"
      @end="drag = false"
      @change="handleChange"
      animation="300"
    >
      <template #item="{ element }">
        <v-card class="mb-2" outlined>
          <v-card-title class="d-flex align-center">
            <h3 class="mr-auto">{{ element.place }}</h3>
            <v-card-actions>
              <v-icon @click="deletePlace(element.place)" class="delete-icon">mdi-delete</v-icon>
            </v-card-actions>
          </v-card-title>
          <v-card-text>
            <placeComponent :place="element" />
            <p>
              Стоимость поездки:
              <strong>
                {{ calculateTotalCost(element.cases) }}
              </strong>
            </p>
          </v-card-text>
        </v-card>
      </template>
    </draggable>
  </v-container>
</template>

<script setup>
import draggable from 'vuedraggable';
import placeComponent from '@/components/placeComponent.vue';
import { defineProps } from "vue";
import { useCaseStore } from '@/stores/counter';
import { useFilteredPlacesStore } from '@/stores/storeFilteredPlaces';

const storeCase = useCaseStore();
const filteredPlacesStore = useFilteredPlacesStore();
const props = defineProps({
  storePlace: {
    type: Object,
    required: true,
  },
});

const handleChange = (evt) => {
  storeCase.updateCases();
};

const calculateTotalCost = (place) => {
  return place.reduce(
    (total, caseIt) => total + parseFloat(caseIt.cost), 0
  );
};

const deletePlace = (place) => {
  storeCase.deletePlace(place);
  filteredPlacesStore.deletePlace(place);
};
</script>