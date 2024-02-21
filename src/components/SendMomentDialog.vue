<template>
  <el-dialog title="发送朋友圈" v-model="dialogVisible">
    <el-form ref="momentForm" :model="momentForm" label-position="top">
      <!-- 朋友圈内容输入 -->
      <el-form-item label="内容">
        <el-input
          type="textarea"
          v-model="momentForm.content"
          rows="2"
        ></el-input>
      </el-form-item>

      <!-- 图片上传 -->
      <el-form-item label="图片">
        <el-upload
          class="upload-demo"
          action="http://localhost:8080/file/upload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-success="handlePictureUploadSuccess"
          :before-upload="beforePictureUpload"
          multiple
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible="previewVisible">
          <img width="100%" :src="previewImage" alt="" />
        </el-dialog>
      </el-form-item>

      <!-- 发送按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitMoment">发送</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "SendMomentDialog",
  data() {
    return {
      dialogVisible: false,
      momentForm: {
        content: "",
        images: [],
      },
      previewVisible: false,
      previewImage: "",
    };
  },
  methods: {
    handlePictureCardPreview(file) {
      this.previewImage = file.url;
      this.previewVisible = true;
    },

    handlePictureUploadSuccess(response) {
      if (response.code === 1) {
        // 假设后端返回的图片 URL 在 response.data 中
        this.momentForm.images.push(response.data);
        console.log("图片上传成功:", response.data);
      } else {
        console.error("图片上传失败:", response.msg);
      }
    },

    beforePictureUpload(file) {
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

    submitMoment() {
      const imagesString = this.momentForm.images.join(",");

      // 创建一个新的请求体对象
      const payload = {
        content: this.momentForm.content,
        images: imagesString, // 使用转换后的图片字符串
      };

      axios
        .post("/moment/sendMoment", payload)
        .then((response) => {
          if (response.data.code === 1) {
            console.log("朋友圈发送成功:", response.data);
            this.momentForm.content = "";
            this.momentForm.images = [];
            this.$emit("update-moments");
          } else {
            console.error("朋友圈发送失败:", response.data.msg);
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
  /* 使用现代简约风格的颜色和字体 */
  color: #333;
  font-family: "Roboto", sans-serif;
}

.upload-demo .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.upload-demo .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.el-dialog .el-header {
  background-color: #f5f7fa;
  color: #409eff;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  line-height: 60px;
}

.el-button--primary {
  background-color: #409eff;
  border-color: #409eff;
}

.el-input textarea {
  border-color: #d1d5db;
}

/* 动画和过渡效果 */
.el-dialog {
  transition: all 0.3s ease;
}
</style>
