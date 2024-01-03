let timer;

export default {
  namespaced: true,
  state() {
    return {
      userId: null,
      token: null,
      didAutoLogout: false,
    };
  },
  mutations: {
    setUser(state, payload) {
      state.token = payload.token;
      state.userId = payload.userId;
      state.didAutoLogout = false;
    },
    setAutoLogout(state) {
      state.didAutoLogout = true;
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
      const expiresIn = +response.formData.expiresIn * 1000;
      const expirationDate = new Date().getTime() + expiresIn;

      localStorage.setItem("token", responseData.idToken);
      localStorage.setItem("userId", responseData.localId);
      localStorage.setItem("tokenExpiration", expirationDate);

      timer = setTimeout(function () {
        context.dispatch("autoLogout");
      }, expiresIn);

      context.commit("setUser", {
        token: responseData.idToken,
        userId: responseData.localId,
      });
    },
    autoLogin(context) {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      const tokenExpiration = localStorage.getItem("tokenExpiration");

      const expiresIn = +tokenExpiration - new Date().getTime();

      if (expiresIn < 0) {
        return;
      }

      timer = setTimeout(function () {
        context.dispatch("autoLogout");
      }, expiresIn);

      if (token && userId) {
        context.commit("setUser", {
          token: token,
          userId: userId,
        });
      }
    },
    logout(context) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("tokenExpiration");

      clearTimeout(timer);

      context.commit("setUser", {
        token: null,
        userId: null,
      });
    },
    autoLogout(context) {
      context.dispatch("logout");
      context.commit("setAutoLogout");
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
    didAutoLogout(state) {
      return state.didAutoLogout;
    },
  },
};
