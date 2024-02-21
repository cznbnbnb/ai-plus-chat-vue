<template>
  <el-dialog class="register-dialog" title="注册账号" v-model="dialogVisible">
    <el-form ref="registerForm" :model="registerForm" label-position="top">
      <!-- 输入邮箱 -->
      <el-form-item label="邮箱">
        <el-input v-model="registerForm.email"></el-input>
      </el-form-item>

      <!-- 输入密码 -->
      <el-form-item label="密码">
        <el-input type="password" v-model="registerForm.password"></el-input>
      </el-form-item>

      <!-- 确认密码 -->
      <el-form-item label="确认密码">
        <el-input
          type="password"
          v-model="registerForm.confirmPassword"
        ></el-input>
      </el-form-item>
      <slider-captcha @verified="handleVerification"></slider-captcha>
      <!-- 输入验证码 -->
      <el-form-item label="验证码">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-input v-model="registerForm.captcha"></el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="getCaptcha" style="float: right"
              >获取验证码</el-button
            >
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitRegistration">确认</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import axios from "axios";
import SliderCaptcha from "./SliderCaptcha.vue";

export default {
  name: "RegisterAccountDialog",
  components: {
    SliderCaptcha,
  },
  data() {
    return {
      dialogVisible: false,
      registerForm: {
        email: "",
        password: "",
        confirmPassword: "",
        captcha: "",
      },
      verified: false,
    };
  },
  methods: {
    handleVerification(verified) {
      this.verified = verified;
    },
    getCaptcha() {
      if (!this.verified) {
        this.$message.error("请先完成滑块验证");
        return;
      }
      // 验证是否满足发送验证码的条件
      if (!this.registerForm.email) {
        this.$message.error("请输入邮箱");
        return;
      }
      // 发送验证码逻辑
      axios
        .post("/user/sendMsg", { email: this.registerForm.email })
        .then((response) => {
          console.log("验证码发送:", response.data);
        })
        .catch((error) => {
          console.error("验证码发送失败:", error);
        });
      console.log("获取验证码");
      this.verified = false;
    },

    submitRegistration() {
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        this.$message.error("两次输入的密码不一致");
        return;
      }
      if (!this.verified) {
        this.$message.error("请先完成滑块验证");
        return;
      }

      // 添加提交注册信息的逻辑
      const payload = {
        email: this.registerForm.email,
        password: this.registerForm.password,
        code: this.registerForm.captcha, // 确保这里的字段与后端期望的字段匹配
      };

      axios
        .post("/user/register", payload)
        .then((response) => {
          // 根据后端的响应处理逻辑
          if (response.data.code === 1) {
            this.$message.success(response.data.msg);
            this.dialogVisible = false; // 注册成功后关闭对话框
          } else {
            this.$message.error(response.data.msg); // 显示错误消息
          }
        })
        .catch((error) => {
          console.error("注册请求失败:", error);
          this.$message.error("注册失败，请稍后再试");
        });
    },
  },
};
</script>

<style>
.el-dialog.register-dialog {
  width: 600px;
  height: auto; /* 或者指定一个足够大的高度值 */
  max-height: 80%; /* 防止对话框过高 */
  overflow-y: auto; /* 允许垂直方向上的滚动 */
  border-radius: 2%;
  backdrop-filter: blur(5px);
  background-color: rgba(255, 255, 255, 0.603);
}
</style>
