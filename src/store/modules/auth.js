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
    signup(context, payload) {
      return context.dispatch("auth", {
        ...payload,
        mode: "signup",
      });
    },
    login(context, payload) {
      return context.dispatch("auth", {
        ...payload,
        mode: "login",
      });
    },
    async auth(context, payload) {
      const firebaseApiKey = context.rootGetters["firebaseApiKey"];
      const mode = payload.mode;
      const apiEndpointUrl =
        mode === "signup"
          ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`
          : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`;

      const response = await fetch(apiEndpointUrl, {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          returnSecureToken: true,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.message ||
            "Failed to authenticate. Check your login data."
        );
        throw error;
      }

      localStorage.setItem("token", responseData.idToken);
      localStorage.setItem("userId", responseData.localId);

      context.commit("setUser", {
        token: responseData.idToken,
        userId: responseData.localId,
        tokenExpiration: responseData.expiresIn,
      });
    },
    autoLogin(context) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (token && userId) {
        context.commit('setUser', {
          token: token,
          userId: userId,
          tokenExpiration: null
        })
      }
    },
    logout(context) {
      context.commit("setUser", {
        token: null,
        userId: null,
        tokenExpiration: null,
      });
    },
  },
  getters: {
    userId(state) {
      return state.userId;
    },
    token(state) {
      return state.token;
    },
    isAuthenticated(state) {
      return !!state.token;
    },
  },
};
