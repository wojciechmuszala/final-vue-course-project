export default {
  namespaced: true,
  state() {
    return {
      userId: null,
      token: null,
      tokenExpiration: null,
    };
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.tokenExpiration = payload.tokenExpiration;
    },
  },
  actions: {
    login() {},
    async signup(context, payload) {
      const firebaseApiKey = context.rootGetters["firebaseDataEndpoint"];
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`,
        {
          method: "POST",
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            returnSecureToken: true,
          }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.log(responseData);
        const error = new Error(responseData.message);
        throw error;
      }

      console.log(responseData);

      context.commit("setUser", {
        token: responseData.idToken,
        userId: responseData.localId,
        tokenExpiration: responseData.expiresIn,
      });
    },
  },
  getters: {
    userId(state) {
      return state.userId;
    },
  },
};
