import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import axios from 'axios';
import store from './store'; // 引入 Vuex store

const app = createApp(App);

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

app.use(router);
app.use(store); // 使用 Vuex store
app.use(ElementPlus);
app.mount('#app');

