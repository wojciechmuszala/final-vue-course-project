export default {
  namespaced: true,
  state() {
    return {
      requests: [],
    };
  },
  mutations: {
    addRequest(state, payload) {
      state.requests.push(payload);
    },
    setRequest(state, payload) {
      state.requests = payload;
    },
  },
  actions: {
    async contactCoach(context, payload) {
      const newRequest = {
        userEmail: payload.userEmail,
        message: payload.message,
      };

      const firebaseDataEndpoint = context.rootGetters["firebaseDataEndpoint"];

      const response = await fetch(
        `${firebaseDataEndpoint}/requests/${payload.coachId}.json`,
        {
          method: "POST",
          body: JSON.stringify(newRequest),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.message || "Failed to send request."
        );
        throw error;
      }

      newRequest.id = responseData.name;
      newRequest.coachId = payload.coachId;

      context.commit("addRequest", newRequest);
    },
    async fetchRequests(context) {
      const coachId = context.getters["auth/userId"];
      const firebaseDataEndpoint = context.rootGetters["firebaseDataEndpoint"];

      const response = await fetch(
        `${firebaseDataEndpoint}/requests/${coachId}.json`,
        { method: "GET" }
      );

      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.message || "Failed to fetch requests."
        );
        throw error;
      }

      const requests = [];
      for (const key in responseData) {
        const request = {
          id: key,
          coachId: coachId,
          userEmail: responseData[key].userEmail,
          message: responseData[key].message,
        };
        requests.push(request);
      }

      context.commit("setRequest", requests);
    },
  },
  getters: {
    requests(state, getters) {
      const coachId = getters["auth/userId"];
      return state.requests.filter((request) => request.coachId === coachId);
    },
    hasRequests(_, getters) {
      return getters.requests && getters.requests.length > 0;
    },
  },
};
