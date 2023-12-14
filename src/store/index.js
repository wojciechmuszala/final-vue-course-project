import { createStore } from "vuex";
import coachesModule from "./modules/coaches.js";
import requestsModule from "./modules/requests.js";
import authModule from "./modules/auth.js";

const store = createStore({
  modules: {
    coaches: coachesModule,
    requests: requestsModule,
    auth: authModule,
  },
  state() {
    return {
      userId: "c3", // hardcoded for test
      firebaseEndpoint: process.env.VUE_APP_FIREBASE_ENDPOINT,
    };
  },
  getters: {
    firebaseEndpoint(state) {
      return state.firebaseEndpoint;
    },
  },
});

export default store;
