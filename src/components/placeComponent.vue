<template>
  <v-container>
    <draggable 
      v-model="place.cases" 
      group="tasks" 
      :item-key="'element.id'" 
      @change="handleChange" 
    >
      <template #item="{ element }"> 
        <v-card  
          class="mb-4" 
          outlined  
          :class="{ 'highlight-error': element.hasError }" 
        >
          <v-card-title class="d-flex justify-space-between align-center"> 
            <div>
              <span class="event-date">  
                {{ formatDate(element.startDate) }} - {{ formatDate(element.endDate) }}  
              </span>  
              <span class="event-name">{{ element.name }}</span> 
            </div>
            <v-btn @click="storeCase.deleteCase(element.id)" class="delete-button"> Удалить </v-btn> 
          </v-card-title> 
          <v-card-text class="text-h6"> 
            <span>Стоимость: {{ element.cost }}₽</span> 
          </v-card-text> 
        </v-card> 
      </template> 
    </draggable> 
  </v-container> 
</template> 

<script setup> 
import draggable from 'vuedraggable'; 
import { useCaseStore } from '@/stores/counter'; 
import { defineProps } from 'vue'; 

const props = defineProps({ 
  place: { 
    type: Object, 
    required: true, 
  }, 
}); 

const storeCase = useCaseStore(); 
const handleChange = (evt) => {   
  const { added, removed } = evt;   
  const tasks = props.place.cases;   

  tasks.forEach(task => task.hasError = false);   

  tasks.forEach((task, index) => {   
    if (index > 0) { 
      const prevTask = tasks[index - 1]; 
      if (new Date(task.startDate) < new Date(prevTask.startDate) ||  
          (new Date(task.startDate).getTime() === new Date(prevTask.startDate).getTime() &&  
           new Date(task.endDate) < new Date(prevTask.endDate))) { 
        task.hasError = true;   
      } 
    }   
    if (index < tasks.length - 1) { 
      const nextTask = tasks[index + 1]; 
      if (new Date(task.startDate) > new Date(nextTask.startDate) ||  
          (new Date(task.startDate).getTime() === new Date(nextTask.startDate).getTime() &&  
           new Date(task.endDate) > new Date(nextTask.endDate))) { 
        task.hasError = true;   
      } 
    }   
  });   
  storeCase.updateCases();   
}; 

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("ru-RU", { month: "long" }).slice(0, 3);
  return `${date.getDate()} ${month}.`;
};
</script> 

<style lang="scss" scoped> 
.event-name { 
  font-weight: bold; 
  margin-left: 8px; 
} 

.event-date { 
  font-style: italic; 
  color: rgb(65, 62, 62); 
} 

.highlight-error { 
  background-color: rgba(255, 0, 0, 0.2);  
} 

.v-card { 
  border-radius: 10px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); 
  transition: transform 0.2s;
  border: 1px solid #007bff;
}

.delete-button {
  background-color: #4069c3;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>
