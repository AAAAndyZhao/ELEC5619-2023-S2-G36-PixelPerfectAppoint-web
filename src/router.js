import { createRouter, createWebHistory } from 'vue-router'
import MainPage from './pages/main-page.vue'
import userApi from './services/user-api.js'
import Postpage from './pages/post-page.vue'

const routes = [
    {
        path: '/404',
        name: '404',
        component: () => import('./pages/404.vue')
    },
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
        component: () => import('./pages/user/account-activation.vue'),
        props: (route) => ({
            token: route.query.token
        })
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
        path: '/post',
        component: Postpage,
        name: 'PostPage',
        children: [
            {
                path: 'detail/:id',
                components: {
                    title: () => import('./components/title/title.vue'),
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/post/post-detail.vue'),
                    info: () => import('./components/user/user-info-detail.vue'),
                    description: () => import('./components/description/description.vue'),
                    comment: () => import('./views/comment/comment.vue')
                    
                }
            }
        ]
    },
    {
        path: '/post',
        component: MainPage,
        name: 'PostUploadPage',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'upload',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/post/post-upload.vue'),
                    side: () => import('./components/main-side.vue')
                }
            }
        ]
    },
    {
        path: '/post',
        component: MainPage,
        name: 'PostEditPage',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'edit/:id',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/post/post-edit.vue'),
                    side: () => import('./components/main-side.vue')
                }
            }
        ]
    },
    {
        path: '/other',
        component: MainPage,
        name: 'OtherPage',
        children: [
            {
                path: ':id',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/other/index.vue'),
                    side: () => import('./components/main-side.vue')
                },
                props: {
                    content: (route) => ({ 
                        userId: route.params.id 
                    })
                }
            },
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
            {
                path:'settings',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/settings/settings.vue'),
                    side: () => import('./components/main-side.vue')
                }
            }
        ]
    },
    {
        path: '/photo',
        redirect: '/photo/upload',
        component: MainPage,
        name: 'PhotoPage',
        children: [
            {
                path: 'upload',
                meta: { requiresAuth: true },
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/photo/upload/photo-upload.vue'),
                    side: () => import('./components/main-side.vue')
                }
            },
            {
                path: 'detail/:id',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/photo/detail/index.vue'),
                },
                props: {
                    content: (route) => ({ 
                        photoId: route.params.id 
                    })
                }
            }
        ]
    },
    {
        path: '/appointment',
        component: MainPage,
        name: 'AppointmentPage',
        meta: { requiresAuth: true },
        children: [
            {
                path: 'create',
                redirect: '/appointment/create/information',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/appointment/create/appointment-create.vue'),
                    side: () => import('./components/main-side.vue')
                },
                children: [
                    {
                        path: 'information',
                        component: () => import('./views/appointment/create/basic-information.vue'),
                    },
                    {
                        path: 'location',
                        component: () => import('./views/appointment/create/location.vue'),
                    },
                    {
                        path: 'participants',
                        component: () => import('./views/appointment/create/participants.vue'),
                    },
                ]
            },
            {
                path: 'create/success',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/appointment/create/success.vue'),
                    side: () => import('./components/main-side.vue')
                },
            },
            {
                path: ':id',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/appointment/detail/index.vue'),
                    side: () => import('./components/main-side.vue')
                },
                props: {
                    content: (route) => ({ 
                        appointmentId: route.params.id 
                    })
                }
            }
        ]
    },
    {
        path: '/appointment/invitation/:id',
        component: MainPage,
        children: [
            {
                path: '',
                name: 'AppointmentInvitationPage',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/appointment/invitation.vue'),
                },
                props: {
                    content: (route) => ({ 
                        appointmentId: route.params.id,
                        token: route.query.token
                    })
                }
            }
        ],
    },
    {
        path: '/search',
        component: MainPage,
        children: [
            {
                path: '',
                name: 'SearchPage',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/search/search.vue'),
                    side: () => import('./components/main-side.vue')
                },
                props: {
                    content: (route) => ({ 
                        keyword: route.query.keyword,
                        searchType: route.query.type
                    })
                }
            }
        ]
    },
    {
        path:'/portfolio',
        component: MainPage,
        children: [
            {
                path:'create',
                name:'PortfolioCreatePage',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/portfolio/portfolio-create.vue'),
                    side: () => import('./components/main-side.vue')
                }
            },
            {
                path:'update/:id',
                name:'PortfolioUpdatePage',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/portfolio/portfolio-edit.vue'),
                    side: () => import('./components/main-side.vue')
                }
            },
            {
                path:'photos-inside/:id',
                name:'PortfolioPhotosInsidePage',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/portfolio/portfolio-content.vue'),
                    side: () => import('./components/main-side.vue')
                }
            }
        ]
    },
    {
        path: '/message',
        component: MainPage,
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'MessagePage',
                components: {
                    header: () => import('./components/main-header.vue'),
                    content: () => import('./views/message/message.vue'),
                },
                props: {
                    content: (route) => ({
                        toUserId: route.query.to
                    })
                }
            }
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
        // redirect=entire path and query string
        next({ name: 'SignInPage', query: { redirect: to.fullPath } })
    } else {
        next()
    }
})


export default router
