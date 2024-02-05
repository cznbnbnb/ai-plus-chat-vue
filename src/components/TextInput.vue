<template>
  <div class="text-input">
    <input
      type="text"
      v-model="message"
      placeholder="输入消息..."
      class="input-field"
      @keyup.enter="sendMessage"
    />
    <button @click="sendMessage" class="send-button">发送</button>
  </div>

  <!-- 图片上传，使用 Element UI 的上传组件 -->
  <el-upload
    class="image-uploader"
    action="http://localhost:8080/file/upload"
    :show-file-list="false"
    :on-success="handleImageSuccess"
    :before-upload="beforeImageUpload"
    list-type="picture-card"
  >
    <img v-if="imagePreview" :src="imagePreview" class="image-preview" />
    <i v-else class="el-icon-plus image-uploader-icon"></i>
  </el-upload>
</template>

<script>
import axios from "axios";
import WebSocketService from "@/services/WebSocketService";

export default {
  data() {
    return {
      message: "",
      imageFile: null,
      imagePreview: "",
    };
  },
  methods: {
    uploadImage(event) {
      const file = event.target.files[0];
      if (file && file.type.startsWith("image/")) {
        const formData = new FormData();
        formData.append("image", file);

        axios
          .post("http://localhost:8080/file/upload", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            this.imagePreview = response.data.url; // 使用服务器返回的永久URL
            this.imageFile = null; // 清除引用
          })
          .catch((error) => {
            console.error("图片上传失败:", error);
          });
      }
    },
    handleImageSuccess(response) {
      if (response.code === 1) {
        this.imagePreview = response.data; // 使用服务器返回的URL更新图片预览
        console.log("图片上传成功:", response.data);
      } else {
        console.error("图片上传失败:", response.msg);
      }
    },

    beforeImageUpload(file) {
      const isImage = file.type.startsWith("image/");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImage) {
        this.$message.error("上传图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
        return false;
      }
      return true;
    },

    sendMessage() {
      if (this.$store.state.currentUser) {
        if (this.message.trim()) {
          const textMessage = this.createChatMessage(this.message, 0);
          WebSocketService.send(textMessage);
          this.message = "";
        }
        if (this.imagePreview) {
          const imageMessage = this.createChatMessage(this.imagePreview, 1);
          WebSocketService.send(imageMessage);
          this.imagePreview = "";
        }
        this.$store.commit('SET_SHOULD_SCROLL_TO_BOTTOM', true);
        console.log("发送消息:", this.message);
      }
    },

    createChatMessage(content, type) {
      return {
        senderId: this.$store.state.currentUser.id,
        senderName: this.$store.state.currentUser.name,
        receiverId: this.$store.state.currentChat.id,
        receiverName: this.$store.state.currentChat.name,
        receiverType: this.$store.state.currentChat.email ? 0 : 1,
        content: content,
        type: type, // 消息类型：0 表示文本，1 表示图片
      };
    },
  },
};
</script>

<style scoped>
.text-input {
  display: flex;
  padding: 5px;
  height: 8vh;
  background-color: #f8f9fa; /* 轻微灰色背景 */
}

.input-field {
  height: auto;
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #d3d3d3; /* 浅灰色边框 */
  border-radius: 4px; /* 圆角设计 */
}

.send-button {
  padding: 5px 10px;
  background-color: #1e88e5;
  color: white;
  border: none;
  border-radius: 4px; /* 圆角设计 */
  cursor: pointer;
}

.send-button:hover {
  background-color: #9ac4d8; /* 鼠标悬停时的颜色 */
}

.image-uploader {
  padding: 10px;
  overflow-y: auto;
  height: 24vh;
  /* 灰色边界线 */
  border: 3px solid #dbdde0;
  border-radius: 5px;
  text-align: center;
  transition: border-color 0.3s ease;
  overflow: hidden; /* 防止内容溢出 */
}

.image-preview {
  max-width: 100%; /* 限制图片最大宽度 */
  max-height: 100%; /* 限制图片最大高度 */
  display: block; /* 确保图片不会有额外的空间 */
  margin: auto; /* 图片居中 */
  object-fit: contain; /* 图片适应容器大小，但不裁剪 */
}

.el-icon-plus {
  font-size: 32px;
  color: #c0c4cc;
}

.image-uploader-icon {
  font-size: 32px;
  color: #c0c4cc;
}

/* 当鼠标悬停在上传区域时，改变图标的颜色 */
.image-uploader:hover .el-icon-plus {
  color: #409eff;
}
</style>
