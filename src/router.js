import { createRouter, createWebHistory } from 'vue-router'

import MainPage from './pages/main-page.vue'

const routes = [
  {
    path: '/SignUp',
    name: 'SignUpPage',
    component: () => import('./pages/user/sign-up.vue')
  },
  {
    path: '/signin',
    name: 'SigninPage',
    component: () => import('./pages/user/sign-in.vue')
  },
  {
    path: '/forgetpassword',
    name: 'ForgetPassword',
    component: () => import('./pages/user/forgot-password.vue')
  },
  {
    path: '/resetpassword',
    name: 'resetPassword',
    component: () => import('./pages/user/reset-password.vue')
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


router.beforeEach((to,from,next)=>{
    const token = localStorage.getItem('token')


    if(to.name !== "SigninPage" && !token) next({name:"SigninPage"})
    else next()
  
  });

export default router
