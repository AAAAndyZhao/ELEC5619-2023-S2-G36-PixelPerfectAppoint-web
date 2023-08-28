import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import axios from './utils/axios'
import VueAxios from 'vue-axios'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'flag-icon-css/css/flag-icons.min.css';
import userModule from './modules/user-module'
import { createStore } from 'vuex';

// Create a new store instance with modules define in modules folder
const store = createStore({
    modules: {
        user: userModule
    }
});

const app = createApp(App)
app.use(router);
app.use(VueAxios, axios);
app.use(store);
app.use(ElementPlus);
app.mount('#app');
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}