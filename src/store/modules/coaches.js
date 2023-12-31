export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      coaches: [
        {
          id: "c1",
          firstName: "First",
          lastName: "Coach",
          areas: ["frontend"],
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          hourlyRate: 30,
        },
        {
          id: "c2",
          firstName: "Second",
          lastName: "Trainer",
          areas: ["backend", "career"],
          description:
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          hourlyRate: 30,
        },
      ],
    };
  },
  mutations: {
    registerCoach(state, payload) {
      // add ready object to array
      state.coaches.push(payload);
    },
    setCoaches(state, payload) {
      state.coaches = payload;
    },
    setFetchTimestamp(state) {
      state.lastFetch = new Date().getTime();
    },
  },
  actions: {
    // prepare data to add to array
    async registerCoach(context, data) {
      try {
        const userId = context.rootGetters["auth/userId"];
        const coachData = {
          firstName: data.first,
          lastName: data.last,
          description: data.desc,
          hourlyRate: data.rate,
          areas: data.areas,
        };

        const firebaseDataEndpoint =
          context.rootGetters["firebaseDataEndpoint"];

        const token = context.rootGetters["auth/token"];

        await fetch(
          `${firebaseDataEndpoint}/coaches/${userId}.json?auth=${token}`,
          {
            method: "PUT",
            body: JSON.stringify(coachData),
          }
        );

        context.commit("registerCoach", {
          ...coachData,
          id: userId,
        });
      } catch (err) {
        console.log(err);
      }
    },
    async loadCoaches(context, payload) {
      if (!payload.forceRefresh && !context.getters.shouldUpdate) {
        return;
      }
      const firebaseDataEndpoint = context.rootGetters["firebaseDataEndpoint"];

      const response = await fetch(`${firebaseDataEndpoint}/coaches.json`, {
        method: "GET",
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(responseData.message || "Failed to fetch!");
        throw error;
      }

      const coaches = [];
      for (const key in responseData) {
        const coach = {
          id: key,
          firstName: responseData[key].firstName,
          lastName: responseData[key].lastName,
          description: responseData[key].description,
          hourlyRate: responseData[key].hourlyRate,
          areas: responseData[key].areas,
        };
        coaches.push(coach);
      }

      context.commit("setCoaches", coaches);
      context.commit("setFetchTimestamp");
    },
  },
  getters: {
    coaches(state) {
      return state.coaches;
    },
    hasCoaches(state) {
      return state.coaches && state.coaches.length > 0;
    },
    isCoach(_, getters, _2, rootGetters) {
      const coaches = getters.coaches;
      const userId = rootGetters["auth/userId"];
      return coaches.some((coach) => coach.id === userId);
    },
    shouldUpdate(state) {
      const lastFetch = state.lastFetch;
      if (!lastFetch) {
        return true;
      }
      const currentTimeStamp = new Date().getTime();
      return (currentTimeStamp - lastFetch) / 1000 > 60;
    },
  },
};
