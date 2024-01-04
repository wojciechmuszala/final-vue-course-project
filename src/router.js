import { createRouter, createWebHistory } from "vue-router";

import store from "./store/index.js";

import CoachesList from "./pages/coaches/CoachesList.vue";
// import CoachDetails from "./pages/coaches/CoachDetails.vue";
// import CoachRegister from "./pages/coaches/CoachRegister.vue";
// import ContactCoach from "./pages/requests/ContactCoach.vue";
// import RequestsRecived from "./pages/requests/RequestsRecived.vue";
// import UserAuth from "./pages/auth/UserAuth.vue";
import NotFound from "./pages/NotFound.vue";

const CoachDetails = () => import("./pages/coaches/CoachesList.vue");
const CoachRegister = () => import("./pages/coaches/CoachRegister.vue");
const ContactCoach = () => import("./pages/requests/ContactCoach.vue");
const RequestsRecived = () => import("./pages/requests/RequestsRecived.vue");
const UserAuth = () => import("./pages/auth/UserAuth.vue");

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/coaches" },
    { path: "/coaches", component: CoachesList },
    {
      path: "/coaches/:id",
      component: CoachDetails,
      props: true,
      children: [{ path: "contact", component: ContactCoach }],
    },
    {
      path: "/register",
      component: CoachRegister,
      meta: { requiresAuth: true },
    },
    {
      path: "/requests",
      component: RequestsRecived,
      meta: { requiresAuth: true },
    },
    { path: "/auth", component: UserAuth, meta: { requiresUnauth: true } },
    { path: "/:notFound(.*)", component: NotFound },
  ],
});

router.beforeEach(function (to, _, next) {
  if (to.meta.requiresAuth && !store.getters["auth/isAuthenticated"]) {
    next("/auth");
  } else if (to.meta.requiresUnauth && store.getters["auth/isAuthenticated"]) {
    next("/coaches");
  } else {
    next();
  }
});

export default router;
