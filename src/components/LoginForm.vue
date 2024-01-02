<template>
  <el-card class="login-container">
    <el-form @submit.prevent="login" ref="loginForm" :model="loginForm" label-position="top">
      <el-form-item label="用户名（邮箱）" required>
        <el-input placeholder="请输入邮箱" v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="验证码" required>
        <el-input placeholder="请输入验证码" v-model="loginForm.password" style="width: 70%;"></el-input>
        <el-button type="primary" @click="sendCode" style="width: 29%; margin-left: 1%;">获取验证码</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import axios from 'axios';
import WebSocketService from '../services/WebSocketService.js';
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          axios.post('/user/login', {
            email: this.loginForm.username,
            code: this.loginForm.password
          })
            .then(response => {
              if (response.data.code === 1) {
                // 登录成功
                console.log('登录成功', response.data);
                this.$store.dispatch('setCurrentUser', response.data.data); // 使用后端返回的用户信息更新 Vuex store
                // 保存token
                localStorage.setItem('token', response.data.map.token);
                WebSocketService.connect('ws://localhost:8080/ws'); // 连接 WebSocket 服务
                // 跳转到首页
                this.$router.push('/home/chat');
              } else {
                // 登录失败
                console.log('登录失败', response.data.msg);
              }
            })
            .catch(error => {
              console.error('请求失败:', error);
            });
        } else {
          console.log("验证失败!");
        }
      });
    },
    sendCode() {
      // 发送验证码逻辑
      axios.post('/user/sendMsg', { email: this.loginForm.username })
        .then(response => {
          console.log('验证码发送:', response.data);
        })
        .catch(error => {
          console.error('验证码发送失败:', error);
        });
    }
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 25px;
}
</style>
