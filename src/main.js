import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import axios from 'axios';


const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount('#app');
// 设置Axios的全局默认配置
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true
