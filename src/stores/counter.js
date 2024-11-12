import { defineStore } from 'pinia';

export const useCaseStore = defineStore('cases', {
  state: () => {
    const storedPlaces = localStorage.getItem('places');
    const storedPlaceId = localStorage.getItem('placeId');
    const storedCaseId = localStorage.getItem('caseId');
    const storedPlaceList = localStorage.getItem('placeList'); 
    return {
      /* @type {{ place: string, cases: [] }[]} */
      places: storedPlaces ? JSON.parse(storedPlaces) : [],
      placeList: storedPlaceList ? JSON.parse(storedPlaceList) : [],
      caseId: storedCaseId ? JSON.parse(storedCaseId) : 0,
      placeId: storedPlaceId ? JSON.parse(storedPlaceId) : 0,
    };
  },
  actions: {
    async addCase(name, cost, place, startDate, endDate) {
      const existingPlace = this.places.find((p) => p.place === place);
      if (!existingPlace) {
        this.places.push({
          place,
          cases: [{ name, cost, startDate, endDate, id: this.caseId++ }],
          id: this.placeId++,
        });
        localStorage.setItem('placeId', JSON.stringify(this.placeId));
        localStorage.setItem('caseId', JSON.stringify(this.caseId));
      } else {
        existingPlace.cases.push({
          name,
          cost,
          startDate,
          endDate,
          id: this.caseId++,
        });
        localStorage.setItem('caseId', JSON.stringify(this.caseId));
      }
      localStorage.setItem('places', JSON.stringify(this.places));
    },
    addPlaceList(place){
      if (!this.placeList.includes(place)) {
        this.placeList.push(place);
        localStorage.setItem('placeList', JSON.stringify(this.placeList));
      }
    },
    deletePlaceFromList(place) { 
      const placeExists = this.places.some(p => p.place === place);
      if (!placeExists) { 
        const index = this.placeList.indexOf(place); 
        if (index !== -1) { 
          this.placeList.splice(index, 1); 
          localStorage.setItem('placeList', JSON.stringify(this.placeList)); 
        }
      }
    },        
    updateCases() {
      localStorage.setItem('places', JSON.stringify(this.places));
    },
    deleteCase(id) { 
      this.places.forEach((place) => { 
        place.cases = place.cases.filter((item) => item.id !== id); 
      }); 
      this.places = this.places.filter((place) => place.cases.length > 0); 
      localStorage.setItem('places', JSON.stringify(this.places)); 
    }, 
    deletePlace(placeName) {
      const index = this.places.findIndex(place => place.place === placeName);
      if (index !== -1) {
        this.places.splice(index, 1);
        localStorage.setItem('places', JSON.stringify(this.places));
      }
    },
  },
});
