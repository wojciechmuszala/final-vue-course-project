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
      firebaseConfig: {
        apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
        endpoint: process.env.VUE_APP_FIREBASE_ENDPOINT,
        projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
      },
    };
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    firebaseConfig(state) {
      return state.firebaseConfig;
    },
  },
});

export default store;
