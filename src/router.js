import { createRouter, createWebHistory } from 'vue-router'

import MainPage from './pages/MainPage.vue'

const routes = [
  {
    path: '/signup',
    name: 'SignUpPage',
    component: () => import('./pages/user/SignUp.vue')
  },
  {
    path: '/signin',
    name: 'SigninPage',
    component: () => import('./pages/user/SignIn.vue')
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
          header: () => import('./components/Header.vue'),
          content: () => import('./views/Home.vue'),
          side: () => import('./components/Side.vue')
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
          header: () => import('./components/Header.vue'),
          content: () => import('./views/user/UserView.vue'),
          side: () => import('./components/Side.vue')
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
    next('/sisu/signin')
  } else {
    next()
  }
})

export default router
