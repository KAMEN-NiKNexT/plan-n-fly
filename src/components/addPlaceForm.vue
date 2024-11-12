<template>
  <v-form @submit.prevent="onSubmit">
    <v-text-field
      v-model="place"
      label="Введите место"
      :rules="[required]"
    ></v-text-field>
    <v-card-action>
      <v-btn type="submit" 
        color="primary" 
        :disabled="!isValid" 
        class="mr-2"
      >
        Добавить
      </v-btn>
      <v-btn 
        type="button" 
        color="secondary"
        @click="$emit('close')"
      >
        Закрыть
      </v-btn>
    </v-card-action>
    <v-list>
      <v-list-item-group class="larger-text">
        <v-list-item
          v-for="place in storeCase.placeList"
          :key="place.place"
        >
          {{ place }}
          <v-btn
            icon
            class="red square-btn"
            style="float: right"
            @click="removePlace(place)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { defineEmits } from 'vue';
import { useCaseStore } from '@/stores/counter';

const storeCase = useCaseStore();
const emit = defineEmits(['submit', 'close']);
const place = ref('');
const required = (value) => !!value || 'Поле обязательно для заполнения';

const isValid = computed(() => {
  return (
    place.value 
  );
});

const onSubmit = () => {
  emit('submit', {
    place: place.value
  });
};

const removePlace = (place) => {
  storeCase.deletePlaceFromList(place);
};
</script>