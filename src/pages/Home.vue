<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col cols="8">
            <v-row class="mb-4">
              <v-col cols="12">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      label="Введите название места"
                      v-model="searchQuery"
                      prepend-icon="mdi-magnify"
                      append-icon="mdi-close"
                      class="ml-3 mr-3 custom-width"
                      @click:prepend="handlePlaceFilter"
                      @click:append="handleClearSearch"
                    />
                  </v-col>
                </v-row>
                <div class="places-container">
                  <draggableComponent
                    :storePlace="filterFlag ? storeFilteredPlaces : storeCase"
                  />
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="4" class="pa-4">
            <v-row>
              <v-col cols="12">
                <v-btn @click="showDialog = true" color="primary" block>
                  Добавить новое событие
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="mt-2">
              <v-col cols="12">
                <v-btn @click="showSchedule = true" color="secondary" block>
                  Запланированные поездки
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12">
                <v-text-field
                  v-model.number="minCost"
                  :rules="[required, number]"
                  label="Минимальная стоимость"
                  class="w-100"
                />
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12">
                <v-text-field
                  v-model.number="maxCost"
                  :rules="[required, number]"
                  label="Максимальная стоимость"
                  class="w-100"
                />
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12" class="d-flex">
                <v-btn 
                  @click="handleFilter"
                  :disabled="!isValid"
                  color="primary"
                  class="mr-2 w-50"
                >
                  Фильтровать
                </v-btn>
                <v-btn
                @click="filterFlag = false"
                color="secondary"
                class="ml-2 w-50"
                >
                  Сбросить фильтр
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="mt-4">
              <v-col cols="12">
                <p>
                  Общая стоимость путешествия:
                  <strong> {{ getCommonCost }} </strong>
                </p>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="showDialog" width="500">
      <v-card>
        <v-card-title> Добавить новое событие </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addNewCase(name, cost, place, startDate, endDate)">
            <v-text-field
              v-model="name"
              label="Введите событие"
              :rules="[required]"
            ></v-text-field>
            <v-text-field
              v-model="cost"
              label="Введите стоимость"
              :rules="[required, number]"
            ></v-text-field>
            <v-combobox
              v-model="place"
              :items="storeCase.placeList" 
              label="Введите место"
              :rules="[required]"
              solo
              clearable
            ></v-combobox>
            <v-menu
              v-model="startDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-model="formattedStartDate"
                  label="Дата начала"
                  readonly
                  v-bind="props"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startDate"
                :locale="locale"
                @change="startDateMenu = false"
              ></v-date-picker>
            </v-menu>
            <v-menu
              v-model="endDateMenu"
              :close-on-content-click="false"
              transition="scale-transition"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-model="formattedEndDate"
                  label="Дата конца"
                  readonly
                  v-bind="props"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="endDate"
                :locale="locale"
                @change="endDateMenu = false"
              ></v-date-picker>
            </v-menu>
            <v-btn type="submit" color="primary" :disabled="!isValidCase">Добавить</v-btn>
            <v-btn type="button" @click="showDialog = false">Закрыть</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showSchedule" width="500">
      <v-card>
        <v-card-title> Хочу поехать в...</v-card-title>
        <v-card-text>
          <addPlaceForm @submit="addNewPlace" @close="showSchedule = false" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCaseStore } from '@/stores/counter';
import { useFilteredPlacesStore } from '@/stores/storeFilteredPlaces';
import draggableComponent from '@/components/draggableComponent.vue';
import addPlaceForm from '@/components/addPlaceForm.vue';

const storeCase = useCaseStore();
const storeFilteredPlaces = useFilteredPlacesStore();
const showDialog = ref(false);
const searchQuery = ref('');
const filterPressed = ref(false);
const showSchedule = ref(false);
const minCost = ref('');
const maxCost = ref('');
const filterFlag = ref(false);
const name = ref('');
const cost = ref('');
const place = ref('');
const startDate = ref(null);
const endDate = ref(null);
const startDateMenu = ref(false);
const endDateMenu = ref(false);
const locale = ref('ru-RU');

const required = (value) =>
  !!value || value === 0 || 'Поле обязательно для заполнения';
const number = (value) => !isNaN(parseFloat(value)) || 'Введите число';

const handleFilter = () => {
  filterFlag.value = true;
  storeFilteredPlaces.filterPlacesByCost(
    minCost.value,
    maxCost.value,
    storeCase.places
  );
};

const handlePlaceFilter = () => {
  filterFlag.value = true;
  filterPressed.value = true;
  storeFilteredPlaces.filterPlacesByPlaceName(
    searchQuery.value,
    storeCase.places
  )
};

const handleClearSearch = () => {
  if (filterPressed.value == true) {
    searchQuery.value = '', 
    filterFlag.value = false, 
    filterPressed.value = false
  }
};

const isValid = computed(() => {
  return !isNaN(parseFloat(maxCost.value)) && !isNaN(parseFloat(minCost.value));
});

const calculateCommonCost = (places) => {
  return places.reduce((total, place) => {
    return (
      total +
      place.cases.reduce(
        (innerTot, caseIt) => innerTot + parseFloat(caseIt.cost),
        0
      )
    );
  }, 0);
};

const getCommonCost = computed(() => {
  const places = filterFlag.value ? storeFilteredPlaces.places : storeCase.places;
  return calculateCommonCost(places);
});

const addNewCase = (name, cost, place, startDate, endDate) => {
  storeCase.addCase(
    name,
    cost, 
    place,
    startDate,
    endDate
  );
  storeCase.addPlaceList(place);
};

const addNewPlace = (place) => {
  storeCase.addPlaceList(place.place);
};

const formattedStartDate = computed(() => {
  if (startDate.value) {
    return formatDate(startDate.value);
  }
  return '';
});

const formattedEndDate = computed(() => {
  if (endDate.value) {
    return formatDate(endDate.value);
  }
  return '';
});

const isValidCase = computed(() => {
  return (
    name.value &&
    !isNaN(parseFloat(cost.value)) &&
    place.value &&
    startDate.value &&
    endDate.value
  );
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
};
</script>

<style lang="sass" scoped>
@import '../assets/styles/main'
.v-list-item
  border-bottom: 1px solid #ccc
  padding: 10px

.v-list-item-title
  font-weight: bold

.places-container
  display: flex
  flex-direction: column

.v-card
  border-radius: 10px

.v-card-title
  font-weight: bold
  font-size: 1.2rem

.custom-width 
  max-width: 1500px

.v-card-text
  padding: 1rem

.larger-text 
  font-size: 1.4rem
  align-items: center
</style>
