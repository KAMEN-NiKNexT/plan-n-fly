import { defineStore } from 'pinia';

export const useFilteredPlacesStore = defineStore('places', {
  state: () => {
    return {
      places: [],
    };
  },
  actions: {
    filterPlacesByCost(minCost, maxCost, places) {
      this.places = places.map((place) => ({
        ...place,
        cases: place.cases.filter(
          (caseItem) => caseItem.cost >= minCost && caseItem.cost <= maxCost
        ),
      }));
    },
    filterPlacesByPlaceName(location, places) {
      this.places = places.filter(place => place.place === location);
    },
    deletePlace(placeName) {
      this.places = this.places.filter(place => place.place !== placeName);
    },
  },
});