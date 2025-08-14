import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import AuthPage from '@/views/AuthPage.vue'
import { forbidUnauthenticated } from './navigationGuard'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      /* beforeEnter: forbidUnauthenticated,
      meta: { requiresAuth: true }, */
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthPage,
      // optional children for /auth/login, /auth/register in future
    },
    {
      path: '/sign',
      name: 'signDocument',
      component: () => import('../views/SignDocument.vue'),
    },
    // Logged-in user viewing their own profile
    {
      path: '/profile',
      name: 'userProfile',
      component: () => import('../views/UserProfile.vue'),
      /* beforeEnter: forbidUnauthenticated, */
    },
  ],
  /*  {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/admin/Dashboard.vue')
        },
        {
          path: 'users',
          component: () => import('@/views/admin/Users.vue')
        }
      ]
    } */
})
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.currentUser) {
    next('/auth')
  } else {
    next()
  }
})

export default router
