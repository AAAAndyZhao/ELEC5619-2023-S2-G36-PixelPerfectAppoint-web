import { createRouter, createWebHistory } from 'vue-router'
import MainPage from './pages/main-page.vue'
import userApi from './services/user-api.js'
import Postpage from './pages/post-page.vue'

const routes = [
    {
        path: '/sign-up',
        name: 'SignUpPage',
        component: () => import('./pages/user/sign-up.vue')
    },
    {
        path: '/sign-in',
        name: 'SignInPage',
        component: () => import('./pages/user/sign-in.vue'),
        props: (route) => ({ redirect: route.query.redirect })
    },
    {
        path: '/sign-out',
        name: 'SignOutPage',
        component: () => import('./pages/user/sign-out.vue')
    },
    {
        path: '/forget-password',
        name: 'ForgetPassword',
        component: () => import('./pages/user/forgot-password.vue')
    },
    {
        path: '/reset-password',
        name: 'ResetPassword',
        component: () => import('./pages/user/reset-password.vue'),
        props: (route) => ({
            token: route.query.token,
            id: route.query.id
        })
    },
    {
        path: '/sign-up-success',
        name: 'SignUpSuccess',
        component: () => import('./pages/user/sign-up-success.vue')
    },
    {
        path: '/activate-account',
        name: 'ActivateAccount',
        component: () => import('./pages/user/account-activation.vue')
    },
    {
        path: '/post',
        redirect: '/post',
        component: Postpage,
        name: 'PostPage',
        children: [
            {
                path: 'detail/:id',
                components: {
                    title: () => import('./components/title/title.vue'),
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/post/post-detail.vue'),
                    info: () => import('./components/user-info/user-info-detail.vue'),
                    description: () => import('./components/description/description.vue'),
                    comment: () => import('./views/comment/comment.vue')
                    
                }
            }
        ]
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
                    content: () => import('./views/Home.vue'),
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
        meta: { requiresAuth: true },
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
        try {
            const verifyTokenRes = await userApi.userLoginVerify();
            isLogin = verifyTokenRes.code === 0;
            if (isLogin == false) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
            }
        }catch (error) {
            console.error('Error during user login verification: ', error);
        }
    }
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth && !isLogin) {
        next(`/sign-in?redirect=${to.path}`)
    } else {
        next()
    }
})


export default router
