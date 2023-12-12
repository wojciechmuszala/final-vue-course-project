import { createStore } from "vuex";
import coachesModule from "./modules/coaches.js";
import requestsModule from "./modules/requests.js";

const store = createStore({
  modules: {
    coaches: coachesModule,
    requests: requestsModule,
  },
  state() {
    return {
      userId: "c3", // hardcoded for test
      firebaseEndpoint: process.env.VUE_APP_FIREBASE_ENDPOINT,
    };
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    firebaseEndpoint(state) {
      return state.firebaseEndpoint;
    },
  },
});

export default store;
