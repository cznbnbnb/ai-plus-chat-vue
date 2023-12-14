import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginForm from '../components/LoginForm.vue';
import ChatView from '../views/ChatView.vue'; // 聊天界面视图，需创建
import ContactsView from '../views/ContactsView.vue'; // 联系人视图
import MomentsView from '../views/MomentsView.vue'; // 朋友圈视图

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage,
    children: [
      {
        path: 'chat',
        name: 'Chat',
        component: ChatView,
      },
      {
        path: 'contacts',
        name: 'Contacts',
        component: ContactsView,
      },
      {
        path: 'moments',
        name: 'Moments',
        component: MomentsView,
      },
    ]
  },
  // 可以添加更多路由
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
