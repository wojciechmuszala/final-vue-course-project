export default {
  namespaced: true,
  state() {
    return {
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
  },
  actions: {
    // prepare data to add to array
    async registerCoach(context, data) {
      try {
        const userId = context.rootGetters.userId;
        const coachData = {
          firstName: data.first,
          lastName: data.last,
          description: data.desc,
          hourlyRate: data.rate,
          areas: data.areas,
        };

        const firebaseEndpoint = context.rootGetters["firebaseEndpoint"];

        await fetch(`${firebaseEndpoint}/coaches/${userId}.json`, {
          method: "PUT",
          body: JSON.stringify(coachData),
        });

        // const responseData = await response.json();
        context.commit("registerCoach", {
          ...coachData,
          id: userId,
        });
      } catch (err) {
        console.log(err);
      }
    },
    async loadCoaches(context) {
      const firebaseEndpoint = context.rootGetters["firebaseEndpoint"];

      const response = await fetch(`${firebaseEndpoint}/coaches.json`, {
        method: "GET",
      });

      if (!response.ok) {
        const error = new Error(responseData.message || "Failed to fetch!");
        throw error;
      }

      const responseData = await response.json();

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
      const userId = rootGetters.userId;
      return coaches.some((coach) => coach.id === userId);
    },
  },
};
