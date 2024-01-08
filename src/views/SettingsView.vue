<template>
  <el-card class="settings-container">
    <el-form ref="settingsForm" :model="settingsForm" label-position="top">
      <!-- 头像上传 -->
      <el-form-item label="头像">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:8080/file/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          list-type="picture-card"
        >
          <img v-if="avatar" :src="avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <!-- 姓名 -->
      <el-form-item label="姓名">
        <el-input v-model="settingsForm.name"></el-input>
      </el-form-item>

      <!-- 性别 -->
      <el-form-item label="性别">
        <el-radio-group v-model="settingsForm.sex">
          <el-radio label="F">女</el-radio>
          <el-radio label="M">男</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱">
        <el-input v-model="settingsForm.email"></el-input>
      </el-form-item>

      <!-- 提交按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存设置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import axios from "axios";

export default {
  name: "SettingsView",
  data() {
    return {
      settingsForm: {
        name: "",
        sex: "",
        email: "",
        avatar: "", // 头像URL
      },
      avatar: "", // 用于展示的头像
    };
  },
  methods: {
    handleAvatarSuccess(response) {
      if (response.code === 1) {
        // 假设后端返回的新头像 URL 在 response.data 中
        this.avatar = `${response.data}`; // 更新头像预览
        this.settingsForm.avatar = this.avatar; // 设置头像URL
        console.log("头像上传成功:", response.data);
      } else {
        console.error("头像上传失败:", response.msg);
      }
    },

    beforeAvatarUpload(file) {
      const isImage = file.type.startsWith("image/");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      return true;
    },

    submitForm() {
      axios
        .post("/user/settings", this.settingsForm)
        .then((response) => {
          if (response.data.code === 1) {
            console.log("设置更新成功:", response.data);
          } else {
            console.error("设置更新失败:", response.data.msg);
          }
        })
        .catch((error) => {
          console.error("请求错误:", error);
        });
    },
  },
  created() {
    if (this.$store.state.currentUser&&this.$store.state.currentUser.id) {
      //初始化页面的时候，从 Vuex store中获取用户信息
      this.settingsForm = this.$store.state.currentUser;
      if (this.settingsForm.avatar){
        this.avatar = this.settingsForm.avatar;
      }
    }
  },
};


</script>


<style scoped>
.settings-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.avatar-uploader {
  display: block;
  width: 100px;
  height: 100px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  display: block;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  line-height: 100px;
  text-align: center;
}
</style>
