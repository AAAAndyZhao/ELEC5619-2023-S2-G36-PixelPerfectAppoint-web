import { createRouter, createWebHistory } from 'vue-router'

import MainPage from './pages/main-page.vue'

const routes = [
  {
    path: '/signup',
    name: 'SignUpPage',
    component: () => import('./pages/user/sign-up.vue')
  },
  {
    path: '/signin',
    name: 'SigninPage',
    component: () => import('./pages/user/sign-in.vue')
  },
  {
    path: '/',
    redirect: '/main',
    component: MainPage,
    name: 'MainPage',
    children: [
      {
        path: 'main',
        components: {
          header: () => import('./components/main-header.vue'),
          content: () => import('./views/home.vue'),
          side: () => import('./components/main-side.vue')
        }
      }
    ]
  },
  {
    path: '/user',
    redirect: '/user/profile',
    component: MainPage,
    name: 'UserPage',
    children: [
      {
        path: 'profile',
        components: {
          header: () => import('./components/main-header.vue'),
          content: () => import('./views/user/user-main.vue'),
          side: () => import('./components/main-side.vue')
        }
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})


router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');
  let isLogin = false;
  if (token) {
    // fake verify token response
    const verifyTokenRes = {
      code: 0
    }
    isLogin = verifyTokenRes.code === 0;
    if(isLogin == false) {
      localStorage.removeItem('token');
    }
  }
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !isLogin) {
    sessionStorage.setItem('beforeLoginRoute', JSON.stringify(to.path))
    next('/signin')
  } else {
    next()
  }
})

export default router
