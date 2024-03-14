import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginForm from '../components/LoginForm.vue';
import ChatView from '../views/ChatView.vue';
import ContactsView from '../views/ContactsView.vue';
import MomentsView from '../views/MomentsView.vue';
import SettingsView from '../views/SettingsView.vue';
import store from '../store'; // 确保这里正确导入了store

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
    meta: { requiresAuth: true }, 
    children: [
      {
        path: 'chat',
        name: 'Chat',
        component: ChatView,
        meta: { requiresAuth: true },
      },
      {
        path: 'contacts',
        name: 'Contacts',
        component: ContactsView,
        meta: { requiresAuth: true },
      },
      {
        path: 'moments',
        name: 'Moments',
        component: MomentsView,
        meta: { requiresAuth: true }, 
      },
      {
        path: 'settings',
        name: 'Settings',
        component: SettingsView,
        meta: { requiresAuth: true },
      },
    ]
  },
  // 可以添加更多路由
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// 移动到这里：在router对象创建后设置全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查该路由是否需要登录权限
  console.log('进入全局前置守卫');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log('需要登录权限');
    if (!store.state.isLoggedIn) {
      console.log('未登录');
      // 未登录，则重定向到登录页面
      next({
        path: '/',
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
