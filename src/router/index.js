import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import AboutView from "@/views/AboutView.vue"
import ManageView from "@/views/ManageView.vue"
import SongView from "@/views/SongView.vue"

import useUserStore from "@/stores/user"

const routes = [
  {
    name: "home",
    path: "/",
    component: HomeView,
  },
  {
    name: "about",
    path: "/about",
    component: AboutView,
  },
  {
    name: "manage",
    // alias: "/manage",
    path: "/manage-music",
    component: ManageView,
    meta: { requiresAuth: true },
    // beforeEnter: (to, from, next) => {
    //   console.log("manage beforeEnter")
    //   next()
    // },
  },
  {
    path: "/manage",
    redirect: { name: "manage" },
  },
  {
    name: "song",
    path: "/song/:id",
    component: SongView,
  },
  { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("@/views/NotFound.vue") },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  linkExactActiveClass: "text-yellow-500",
})

// Navigation Guards
router.beforeEach((to, from) => {
  // console.log(to.meta)
  if (!to.meta.requiresAuth) {
    return true
  }

  const userStore = useUserStore()
  if (userStore.userLoggedIn) {
    return true
  } else {
    return { name: "home" }
  }
})

export default router
