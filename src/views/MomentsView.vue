<template>
  <div class="moments-view">
    <el-container class="container">
      <el-header class="header">
        <h1 class="title">朋友圈</h1>
        <el-button
          type="primary"
          class="send-moment-btn"
          @click="showSendMomentDialog"
        >
          发送动态
        </el-button>
      </el-header>
      <el-main class="main">
        <!-- 朋友圈动态列表 -->
        <div class="moment" v-for="moment in moments" :key="moment.id">
          <div class="user-info">
            <img :src="moment.avatar" class="user-avatar" alt="User Avatar" />
            <h3 class="user-name">{{ moment.user }}</h3>
          </div>
          <p class="moment-content">{{ moment.content }}</p>
          <div
            v-if="moment.images && moment.images.length"
            class="moment-images"
          >
            <img
              v-for="image in moment.images"
              :src="image"
              :key="image"
              class="moment-image"
            />
          </div>
          <el-button
            v-if="isCurrentUser(moment.userId)"
            class="delete-moment-btn"
            type="danger"
            size="mini"
            @click="deleteMoment(moment.id)"
          >
            删除
          </el-button>
        </div>
      </el-main>
    </el-container>
    <send-moment-dialog
      ref="sendMomentDialog"
      @update-moments="fetchMoments"
    ></send-moment-dialog>
  </div>
</template>

<script>
import axios from "axios";
import SendMomentDialog from "../components/SendMomentDialog.vue"; // 引入发送朋友圈的组件

export default {
  name: "MomentsView",
  components: {
    SendMomentDialog, // 注册组件
  },
  data() {
    return {
      moments: [],
    };
  },
  created() {
    this.fetchMoments();
  },
  methods: {
    fetchMoments() {
      axios
        .get("/moment/getMoments")
        .then((response) => {
          if (response.data.code === 1) {
            this.moments = response.data.data.records.map((moment) => {
              // 适应单张或多张图片的情况
              let imageArray = [];
              if (moment.images.includes(",")) {
                imageArray = moment.images.split(",");
              } else if (moment.images) {
                imageArray = [moment.images];
              }

              return {
                id: moment.id,
                user: moment.name, // 使用返回的用户名
                userId: moment.userId,
                avatar: moment.avatar, // 使用返回的头像链接
                content: moment.content,
                images: imageArray,
              };
            });
          } else {
            console.error("获取朋友圈数据失败:", response.data.msg);
          }
        })
        .catch((error) => {
          console.error("请求朋友圈数据出错:", error);
        });
    },
    showSendMomentDialog() {
      this.$refs.sendMomentDialog.dialogVisible =
        !this.$refs.sendMomentDialog.dialogVisible;
    },
    isCurrentUser(userId) {
      return this.$store.state.currentUser.id === userId;
    },

    deleteMoment(momentId) {
      axios
        .post("/moment/deleteMoment", { momentId })
        .then((response) => {
          if (response.data.code === 1) {
            // 检查code字段是否为1
            this.moments = this.moments.filter(
              (moment) => moment.id !== momentId
            );
            this.$message({ type: "success", message: "朋友圈删除成功" });
          } else {
            // 如果code不为1，使用后端传来的错误信息
            this.$message({
              type: "error",
              message: response.data.msg || "删除失败",
            });
          }
        })
        .catch((error) => {
          console.error("删除朋友圈出错:", error);
          this.$message({ type: "error", message: "删除过程中出现错误" });
        });
    },
  },
};
</script>

<style scoped>
.moments-view {
  font-family: "Roboto", sans-serif;
  color: #333;
}

.container {
  background-color: #fff;
}

.header {
  background-color: #f0f2f5;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 24px;
  color: #409eff;
}

.send-moment-btn {
  background-color: #409eff;
  color: white;
}

.main {
  padding: 20px;
}

.moment {
  position: relative;
  border-bottom: 1px solid #eaeaea;
  padding: 20px 0;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%; /* Circular avatar */
  margin-right: 15px;
}

.user-name {
  font-size: 18px;
  color: #333;
  margin: 0;
}

.moment-content {
  margin: 10px 0;
  line-height: 1.5;
}

.moment-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px; /* Spacing between images */
}

.delete-moment-btn {
  position: absolute;
  bottom: 10px; /* 距离底部的距离 */
  right: 10px; /* 距离右侧的距离 */
  border: none; /* 可选：移除边框 */
  background-color: #409eff;
  color: white; /* 字体颜色 */
  border-radius: 4px; /* 圆角 */
  opacity: 0.8; /* 透明度 */
  transition: opacity 0.3s; /* 平滑过渡效果 */
}

.delete-moment-btn:hover {
  opacity: 1; /* 鼠标悬停时不透明 */
}

.moment-image {
  width: calc(33.333% - 10px); /* Three images per row with spacing */
  height: auto;
  border-radius: 10px; /* Slightly rounded corners for images */
}
</style>
