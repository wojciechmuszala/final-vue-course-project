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
      firebaseConfig: {
        apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
        dataEndpoint: process.env.VUE_APP_FIREBASE_DATA_ENDPOINT,
      },
    };
  },
  getters: {
    firebaseApiKey(state) {
      return state.firebaseConfig.apiKey;
    },
    firebaseDataEndpoint(state) {
      return state.firebaseConfig.dataEndpoint;
    },
  },
});

export default store;
