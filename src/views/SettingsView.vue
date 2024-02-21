<template>
  <el-card class="settings-container">
    <el-form ref="settingsForm" :model="settingsForm" label-position="top">
      <!-- 头像上传 -->
      <el-form-item label="头像：">
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
      <el-form-item label="姓名：">
        <el-input v-model="settingsForm.name"></el-input>
      </el-form-item>

      <!-- 性别 -->
      <el-form-item label="性别：">
        <el-radio-group v-model="settingsForm.sex">
          <el-radio label="F">女</el-radio>
          <el-radio label="M">男</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 邮箱 -->
      <el-form-item label="邮箱：" >
        <el-input v-model="settingsForm.email"></el-input>
      </el-form-item>

      <!-- 旧密码（未设置请置空） -->
      <el-form-item label="旧密码（首次无需）：">
        <el-input v-model="settingsForm.oldPassword" type="password" oncopy="return false"></el-input>
      </el-form-item>

      <!-- 新密码 -->
      <el-form-item label="新密码：">
        <el-input v-model="settingsForm.newPassword" type="password"></el-input>
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
        oldPassword: "",
        newPassword: "",
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
      if (this.settingsForm.oldPassword && !this.settingsForm.newPassword) {
        this.$message.error("请输入新密码");
        return;
      }
      if (!this.settingsForm.oldPassword && this.settingsForm.newPassword) {
        this.$message.error("请输入旧密码");
        return;
      }
      if (this.settingsForm.oldPassword && this.settingsForm.newPassword) {
        if (this.settingsForm.oldPassword === this.settingsForm.newPassword) {
          this.$message.error("新密码不能与旧密码相同");
          return;
        }
      }
      if (!this.settingsForm.email) {
        this.$message.error("请输入邮箱");
        return;
      }
      // 提交设置
      axios
        .post("/user/settings", this.settingsForm)
        .then((response) => {
          if (response.data.code === 1) {
            console.log("设置更新成功:", response.data);
            this.$message.success(response.data.msg);
          } else {
            console.error("设置更新失败:", response.data.msg);
            this.$message.error(response.data.msg);
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
      console.log("用户信息:", this.settingsForm);
      if (this.settingsForm.avatar){
        this.avatar = this.settingsForm.avatar;
      }
    }
  },
};


</script>


<style scoped>
.settings-container {
  display: flex;
  width: 40%;
  height: 85%;
  margin: 30px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(0,0,0,.1); /* 添加阴影效果 */
  background-color: #fff; /* 背景色 */
  border-radius: 8px; /* 圆角 */
  overflow: auto; /* 允许滚动 */
}

.el-form-item {
  margin-bottom: 10px; /* 增加表单项间距 */
}

.el-button {
  margin-bottom: 25px; /* 调整按钮下边距 */
}

.el-form-item label {
  font-weight: bold; /* 加粗标签字体 */
}

.avatar-uploader {
  border: none; /* 移除虚线边框 */
  margin-bottom: 15px; /* 调整下边距 */
}

.avatar {
  border-radius: 50%; /* 头像圆形显示 */
  width: 120px; /* 调整宽度 */
  height: 120px; /* 调整高度 */
  object-fit: cover; /* 保证图片比例 */
  margin: 0 auto; /* 居中显示 */
}

.avatar-uploader-icon {
  color: #409eff; /* 调整图标颜色 */
}

.el-button {
  width: 100%; /* 按钮宽度全填充 */
}

.el-input, .el-radio-group {
  border-radius: 4px; /* 输入框和单选按钮组圆角 */
}
.el-upload .el-upload__button {
  display: none; /* 隐藏默认的上传按钮 */
}

.avatar-uploader .el-upload-dragger {
  display: flex;
  justify-content: center;
  align-items: center;
}

* {
  font-weight: bold;
}

</style>
