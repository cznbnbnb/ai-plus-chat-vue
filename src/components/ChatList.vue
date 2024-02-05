<template>
  <div class="chat-list-container">
    <div class="chat-list">
      <el-list v-if="friends.length">
        <el-list-item
          v-for="friend in friends"
          :key="friend.userId"
          @click="selectFriend(friend)"
        >
          <div class="friend-info">
            <el-avatar :src="getAvatar(friend)"></el-avatar>
            <div class="info-text">
              <span class="friend-name">{{
                friend.remark || friend.name || friend.email
              }}</span>
              <span class="last-message">{{ friend.lastMessage }}</span>
            </div>
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
    this.getGroupList();
  },
  methods: {
    getGroupList() {
      axios
        .get("group/getGroupList", { withCredentials: true })
        .then((response) => {
          if (response.data && Array.isArray(response.data.data)) {
            this.friends = this.friends.concat(response.data.data);
          } else {
            // 如果响应不是预期格式，保持 friends 为初始的空数组或设置为其他默认值
            this.friends = []; // 或其他默认值，如 [{}] 或 [默认好友对象]
          }
        })
        .catch((error) => {
          console.error("获取群组列表失败:", error);
          this.friends = []; // 发生错误时，设置为初始的空数组或其他默认值
        });
    },
    getFriendList() {
      axios
        .get("user/getFriendList", { withCredentials: true })
        .then((response) => {
          if (response.data && Array.isArray(response.data.data)) {
            this.friends = this.friends.concat(response.data.data);
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
    getAvatar(friend) {
      return friend.avatar || require("@/assets/doge.png");
    },
    selectFriend(friend) {
      console.log("选择好友:", friend);
      this.$store.dispatch("setCurrentChat", friend);
    },
  },
};
</script>

<style scoped>
.chat-list-container {
  border: 1px solid #eadede; /* 灰色边框 */
  border-radius: 5px; /* 圆角边框 */
  background-color: #ffffff;
  overflow: hidden; /* 隐藏超出边框的内容 */
  width: auto; /* 宽度自适应 */
  height: 100%; /* 高度自适应 */
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
  border-bottom: 1px solid #d3d3d3;
  cursor: pointer;
}

.el-list-item:hover {
  background-color: #cacbcc;
  /* 悬停时的背景颜色 */
}

.el-avatar {
  flex-shrink: 0;
  width: 40px; /* 设置统一的头像大小 */
  height: 40px; /* 设置统一的头像大小 */
  border-radius: 50%; /* 圆形头像 */
  margin-right: 10px;
}
.friend-info {
  display: flex;
  align-items: center;
  overflow: hidden;
  margin-left: 7px;
  margin-left: 7px;
  margin-top: 5px;
  /*增加灰色下划线分隔*/
  border-bottom: 1px solid #d3d3d3;
}

.friend-info:hover {
  background-color: #f0f0f0;
  /* 悬停时的背景颜色 */
}

.no-friends {
  text-align: center;
  color: #999;
  padding: 20px;
}

.info-text {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
  padding-left: 5px; 
  padding-top: 5px;
  margin-top: 2px;
}

.friend-name, .last-message {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.last-message {
  color: #999; /* 设置浅灰色字体 */
}

</style>
