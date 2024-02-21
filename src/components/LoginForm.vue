<template>
  <div
    class="background"
    :style="{ backgroundImage: 'url(' + backgroundImage + ')' }"
  >
    <MouseTrail></MouseTrail>
    <!-- 这里插入鼠标轨迹组件 -->
    <el-card class="login-container">
      <el-form
        @submit.prevent="login"
        ref="loginForm"
        :model="loginForm"
        label-position="top"
      >
        <el-form-item label="用户名（邮箱）" required>
          <el-input
            placeholder="请输入邮箱"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <div class="form-transition-group">
          <transition-group
            name="fade-slide"
            tag="div"
            class="form-items-container"
          >
            <el-form-item
              v-if="isCodeLogin"
              label="验证码"
              required
              key="code-login"
            >
              <el-input
                placeholder="请输入验证码"
                v-model="loginForm.code"
                class="verification-code-input"
              ></el-input>
              <el-button
                type="primary"
                @click="sendCode"
                class="verification-code-btn"
                >获取验证码</el-button
              >
            </el-form-item>
            <el-form-item v-else label="密码" required key="password-login">
              <el-input
                placeholder="请输入密码"
                v-model="loginForm.password"
                type="password"
                class="password-input"
              ></el-input>
            </el-form-item>
          </transition-group>
        </div>
        <slider-captcha @verified="handleVerification"></slider-captcha>
        <el-form-item class="fixed-buttons">
          <div style="display: flex; justify-content: flex-end; gap: 44px">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button @click="showLoginDialog">注册</el-button>
            <el-button type="primary" @click="toggleLoginMethod">{{
              isCodeLogin ? "切换到密码登录" : "切换验证码登录"
            }}</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
  <register-account-dialog
    ref="RegisterAccountDialog"
  ></register-account-dialog>
</template>

<script>
import axios from "axios";
import WebSocketService from "../services/WebSocketService.js";
import MouseTrail from "../components/MouseTrail.vue";
import RegisterAccountDialog from "./littleComponents/RegisterAccountDialog.vue";
import SliderCaptcha from "./littleComponents/SliderCaptcha.vue";

export default {
  components: {
    MouseTrail,
    RegisterAccountDialog,
    SliderCaptcha,
  },
  data() {
    return {
      backgroundImage: require("@/assets/background.jpg"),
      loginForm: {
        username: "",
        password: "",
      },
      isCodeLogin: false,
      pixaldata: [],
      pixallife: 300,
      verified: false,
    };
  },
  methods: {
    toggleLoginMethod() {
      this.isCodeLogin = !this.isCodeLogin;
      this.loginForm.password = ""; // 切换时清空密码/验证码输入框
    },
    handleVerification(verified) {
      this.verified = verified;
    },
    login() {
      if (!this.verified) {
        this.$message.error("请先完成滑块验证");
        return;
      }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          axios
            .post("/user/login", {
              email: this.loginForm.username,
              code: this.loginForm.code,
              password: this.loginForm.password,
            })
            .then((response) => {
              if (response.data.code === 1) {
                // 登录成功
                console.log("登录成功", response.data);
                this.$store.dispatch("setCurrentUser", response.data.data); // 使用后端返回的用户信息更新 Vuex store
                // 保存token
                localStorage.setItem("token", response.data.map.token);
                WebSocketService.connect("ws://localhost:8080/ws"); // 连接 WebSocket 服务
                // 跳转到首页
                this.$router.push("/home/chat");
              } else {
                // 登录失败
                console.log("登录失败", response.data.msg);
              }
            })
            .catch((error) => {
              console.error("请求失败:", error);
            });
        } else {
          console.log("验证失败!");
        }
      });
      this.verified = false; // 重置验证状态
    },
    sendCode() {
      if (!this.verified) {
        this.$message.error("请先完成滑块验证");
        return;
      }
      // 发送验证码逻辑
      axios
        .post("/user/sendMsg", { email: this.loginForm.username })
        .then((response) => {
          console.log("验证码发送:", response.data);
        })
        .catch((error) => {
          console.error("验证码发送失败:", error);
        });
      this.verified = false; // 重置验证状态
    },
    showLoginDialog() {
      this.$refs.RegisterAccountDialog.dialogVisible =
        !this.$refs.RegisterAccountDialog.dialogVisible;
    },
  },
};
</script>

<style scoped>
.verification-code-input {
  width: 200px;
}
.verification-code-btn {
  width: 110px;
  margin-left: 50px;
}
.password-input {
  width: 360px;
}
.background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
}

.form-items-container {
  position: relative;
  width: 100%; /* 确保容器宽度与父元素一致 */
  min-height: 100px; /* 根据实际内容调整 */
}

.login-container {
  max-width: 400px;
  margin: 200px auto;
  padding: 25px;
  backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  min-height: 250px;
  max-height: 280px;
}

.form-transition-group {
  position: relative;
  width: 100%;
  min-height: 80px; /* 根据实际内容调整 */
  max-height: 80px; /* 根据实际内容调整 */
}

.form-items-container {
  position: relative;
  min-height: 80px; /* 根据实际内容调整 */
  max-height: 80px; /* 根据实际内容调整 */
}

.fixed-buttons {
  position: relative;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  position: absolute;
  transition: opacity 0.5s ease;
}
.fade-slide-enter,
.fade-slide-leave-to {
  opacity: 0;
  position: absolute;
  width: 100%;
}
.el-button:hover {
  transform: scale(1.05);
}
</style>
