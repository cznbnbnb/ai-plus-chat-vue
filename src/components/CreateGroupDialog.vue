<template>
    <el-dialog title="创建群聊" v-model="dialogVisible">
      <el-form ref="groupForm" :model="groupForm" label-position="top">
        <!-- 群名称输入 -->
        <el-form-item label="群名称">
          <el-input v-model="groupForm.name"></el-input>
        </el-form-item>
  
        <!-- 群头像上传 -->
        <el-form-item label="群头像">
          <el-upload
            class="avatar-upload"
            action="http://localhost:8080/file/upload"
            list-type="picture-card"
            :on-preview="handleAvatarPreview"
            :on-success="handleAvatarUploadSuccess"
            :before-upload="beforeAvatarUpload"
            :limit="1"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible="previewVisible">
            <img width="100%" :src="previewImage" alt="群头像预览" />
          </el-dialog>
        </el-form-item>
  
        <!-- 创建按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitGroup">创建</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "CreateGroupDialog",
    data() {
      return {
        dialogVisible: false,
        groupForm: {
          name: "",
          avatar: "",
        },
        previewVisible: false,
        previewImage: "",
      };
    },
    methods: {
      handleAvatarPreview(file) {
        this.previewImage = file.url;
        this.previewVisible = true;
      },
  
      handleAvatarUploadSuccess(response) {
        if (response.code === 1) {
          this.groupForm.avatar = response.data; // 假设后端返回的头像 URL 在 response.data 中
          console.log("头像上传成功:", response.data);
        } else {
          console.error("头像上传失败:", response.msg);
        }
      },
  
      beforeAvatarUpload(file) {
        const isImage = file.type.startsWith("image/");
        const isLt2M = file.size / 1024 / 1024 < 2;
  
        if (!isImage) {
          this.$message.error("只能上传 JPG/PNG 格式的图片!");
          return false;
        }
        if (!isLt2M) {
          this.$message.error("上传图片大小不能超过 2MB!");
          return false;
        }
        return true;
      },
  
      submitGroup() {
        const payload = {
          name: this.groupForm.name,
          avatar: this.groupForm.avatar, // 使用上传的头像 URL
        };
  
        axios
          .post("/group/create", payload)
          .then((response) => {
            if (response.data.code === 1) {
              console.log("群聊创建成功:", response.data);
              this.groupForm.name = "";
              this.groupForm.avatar = "";
              // 这里可以触发一个事件或执行其它逻辑，例如更新群聊列表
            } else {
              console.error("群聊创建失败:", response.data.msg);
            }
          })
          .catch((error) => {
            console.error("请求错误:", error);
          });
        this.dialogVisible = false;
      },
    },
  };
  </script>
  <style scoped>
  .el-dialog {
    /* 对话框的基础样式 */
    min-width: 400px;
  }
  
  .el-form-item {
    margin-bottom: 20px;
  }
  
  .el-form-item label {
    color: #606266; /* 灰色调的标签 */
  }
  
  .el-input,
  .el-textarea {
    border-color: #dcdfe6; /* 灰色边框 */
  }
  
  .el-button {
    background-color: #409eff; /* 蓝色按钮 */
    border-color: #409eff;
    color: white;
  }
  
  .el-button:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
  }
  
  .avatar-upload .el-upload {
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  
  .avatar-upload .el-upload:hover {
    border-color: #409eff;
  }
  
  .upload-demo i {
    font-size: 28px;
    color: #8c939d; /* 图标颜色 */
  }
  
  .upload-demo .el-upload__input {
    opacity: 0;
  }
  
  </style>
  
  