<template>
  <div class="chat-list-container">
    <div class="chat-list">
      <el-list v-if="friends.length">
        <el-list-item
          v-for="friend in friends"
          :key="friend.userId"
          @click="selectFriend()"
        >
          <el-avatar :src="friend.avatar"></el-avatar>
          <div class="friend-info">
            <h4>{{ friend.name }}</h4>
            <p>{{ friend.remark }}</p>
          </div>
        </el-list-item>
      </el-list>
      <div v-else class="no-friends">暂无已交流的好友，快去与好友聊天吧</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChatList",
  data() {
    return {
      friends: [],
    };
  },
  mounted() {
    this.getFriendList();
  },
  methods: {
    getFriendList() {
      axios
        .get("user/getFriendList", { withCredentials: true })
        .then((response) => {
          if (response.data && Array.isArray(response.data.data)) {
            this.friends = response.data.data;
          } else {
            // 如果响应不是预期格式，保持 friends 为初始的空数组或设置为其他默认值
            this.friends = []; // 或其他默认值，如 [{}] 或 [默认好友对象]
          }
        })
        .catch((error) => {
          console.error("获取好友列表失败:", error);
          this.friends = []; // 发生错误时，设置为初始的空数组或其他默认值
        });
    },

    selectFriend() {
      // 处理选中好友的逻辑
    },
  },
};
</script>

<style scoped>
.chat-list-container {
  border: 1px solid #d3d3d3; /* 灰色边框 */
  border-radius: 5px; /* 圆角边框 */
  overflow: hidden; /* 隐藏超出边框的内容 */
  width: 190px; /* 设定宽度 */
  height: 550px; /* 设定高度 */
}

.chat-list {
  max-height: 550px; /* 与容器高度一致 */
  overflow-y: auto; /* 内容过多时出现滚动条 */
  /* 其他样式 */
}

.el-list-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.el-list-item:hover {
  background-color: #f5f7fa;
  /* 悬停时的背景颜色 */
}

.friend-info {
  margin-left: 10px;
  /* 头像和信息之间的间距 */
}

.no-friends {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>
