import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import AuthPage from '@/views/AuthPage.vue'
import { forbidUnauthorized } from './navigationGuard'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/auth/',
      name: 'auth',
      component: AuthPage,
    },
    {
      path: '/sign',
      name: 'signDocument',
      component: () => import('../views/SignDocument.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/verify',
      name: 'verifyDocument',
      component: () => import('../views/VerifyDocument.vue'),
    },

    {
      path: '/profile',
      name: 'userProfile',
      component: () => import('../views/UserProfile.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/forgot-password',
      name: 'forgotPassword',
      component: () => import('../views/ForgotPassword.vue'),
    },
    {
      path: '/reset-password/',
      name: 'resetPassword',
      component: () => import('../views/ResetPassword.vue'),
    },
    {
      path: '/admin/',
      name: 'adminDashboard',
      component: () => import('../views/AdminDashboard.vue'),
      beforeEnter: forbidUnauthorized,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  try {
    //initalize user on every page load

    await userStore.initializeUser()

    //protected routes
    if (to.meta.requiresAuth && !userStore.currentUser) {
      next('/auth')
    } else {
      next()
    }
  } catch (error) {
    console.error(error)
    next('/auth')
  }
})

export default router
