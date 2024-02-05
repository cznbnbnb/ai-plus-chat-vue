<template>
  <div class="moments-view">
    <el-container class="container">
      <el-header class="header">
        <h1 class="title">朋友圈</h1>
        <div class="buttons-container">
          <el-button type="primary" @click="toggleMyMoments">{{
            showingMyMoments ? "回到全部圈" : "查看我的圈"
          }}</el-button>
          <el-button
            type="primary"
            class="send-moment-btn"
            @click="showSendMomentDialog"
            >发送动态</el-button
          >
        </div>
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
          <div class="moment-time">
            <span>{{ moment.createTime }}</span>
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
      showingMyMoments: false,
      page: 1, // 当前页码
      limit: 20, // 每页数量
      allLoaded: false, // 是否已加载所有内容
      lastReminderTime: 0, // 上次提醒的时间戳
    };
  },
  created() {
    this.fetchMoments();
  },
  mounted() {
    this.fetchMoments();
    const elMain = this.$el.querySelector(".el-main");
    elMain.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    const elMain = this.$el.querySelector(".el-main");
    if (elMain) {
      elMain.removeEventListener("scroll", this.handleScroll);
    }
  },
  methods: {
    handleScroll() {
      const elMain = this.$el.querySelector(".el-main");
      if (elMain.scrollHeight - elMain.scrollTop <= elMain.clientHeight + 1) {
        // 加1为了提高兼容性
        this.fetchMoments(true); // 加载更多
      }
    },
    fetchMoments(loadMore = false) {
      if (this.allLoaded) {
        const currentTime = Date.now();
        if (currentTime - this.lastReminderTime > 3000) {
          // 3秒内没有发送过提醒
          this.$message({ type: "info", message: "已加载所有内容" });
          this.lastReminderTime = currentTime; // 更新上次提醒时间
        }
        return;
      }

      if (loadMore) {
        this.page++;
      } else {
        this.page = 1;
        this.allLoaded = false;
      }

      const url = this.showingMyMoments
        ? "/moment/getMyMoments"
        : "/moment/getMoments";
      axios
        .get(url, { params: { page: this.page, limit: this.limit } })
        .then((response) => {
          if (response.data.code === 1) {
            const fetchedMoments = response.data.data.records.map((moment) => {
              let imageArray = moment.images.includes(",")
                ? moment.images.split(",")
                : moment.images
                ? [moment.images]
                : [];
              return {
                id: moment.id,
                user: moment.name,
                userId: moment.userId,
                avatar: moment.avatar,
                createTime: moment.createTime,
                content: moment.content,
                images: imageArray,
              };
            });

            if (loadMore) {
              this.moments = [...this.moments, ...fetchedMoments];
            } else {
              this.moments = fetchedMoments;
            }

            if (fetchedMoments.length < this.limit) {
              this.allLoaded = true;
            }
          } else {
            console.error("获取朋友圈数据失败:", response.data.msg);
          }
        })
        .catch((error) => {
          console.error("请求朋友圈数据出错:", error);
        });
    },
    toggleMyMoments() {
      this.allLoaded = false;
      this.showingMyMoments = !this.showingMyMoments;
      this.fetchMoments();
    },
    getMyMoments() {
      this.allLoaded = false;
      this.showingMyMoments = true;
      this.fetchMoments();
    },
    showSendMomentDialog() {
      this.allLoaded = false;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* 增加边界线 */
  border-bottom: 2px solid #eaeaea;
}

.buttons-container {
  display: flex;
  gap: 10px; /* 控制按钮之间的间距 */
}

.send-moment-btn {
  /* 移除margin-left样式，因为已经有gap控制间距 */
  background-color: #409eff;
  color: white;
}

.title {
  font-size: 24px;
  color: #409eff;
  /*更美观的字体设计 */
  font-family: "Roboto", sans-serif;
  display: flex;
}

.main {
  overflow-y: auto; /* 允许在Y轴方向上滚动 */
  max-height: calc(100vh - 70px); /* 视口高度减去头部的高度 */
  padding: 20px;
}

.moment {
  position: relative;
  border-bottom: 1px solid #eaeaea;
  padding: 20px 0;
}

.moment-time {
  font-size: 12px;
  color: #888;
  margin-top: 10px;
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
