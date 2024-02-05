<template>
  <div class="contacts-view">
    <el-container>
      <el-header>
        <el-input
          placeholder="搜索好友或群聊..."
          v-model="searchText"
          class="search-input"
        />
        <el-input
          placeholder="附加消息..."
          v-model="additionalMessage"
          class="additional-message"
        />
        <el-button type="primary" icon="el-icon-search" @click="addFriend"
          >添加好友</el-button
        >
        <el-button type="primary" icon="el-icon-search" @click="joinGroup"
          >加入群聊</el-button
        >
        <el-button
          type="success"
          icon="el-icon-plus"
          @click="showCreateGroupDialog"
          >创建群聊</el-button
        >
        <el-button type="info" @click="openInBox">
          <el-icon><Message /></el-icon>
          收件箱
        </el-button>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="12">
            <div v-if="groupChats.length" class="group-list">
              <h3 class="title-border">群聊</h3>
              <div
                v-for="group in groupChats"
                :key="group.id"
                class="contact-item"
                @contextmenu.prevent="showGroupMenu($event, group)"
                @dblclick="handleDblClick(group)"
              >
                <img
                  :src="group.avatar ? group.avatar : require('@/assets/doge.png')"
                  alt="群聊头像"
                  class="avatar"
                />
                <span>{{ group.name }}</span>
              </div>
            </div>
            <div v-else class="group-list">
              <h3 class="title-border">群聊</h3>
              <p class="tip-text">还未添加群聊哦，快去添加吧！</p>
            </div>
          </el-col>
          <el-col :span="12">
            <div v-if="friends.length" class="friend-list">
              <h3 class="title-border">好友</h3>
              <div
                v-for="friend in friends"
                :key="friend.id"
                class="contact-item"
                @contextmenu.prevent="showFriendMenu($event, friend)"
                @dblclick="handleDblClick(friend)"
              >
                <img
                  :src="
                    friend.avatar ? friend.avatar : require('@/assets/doge.png')
                  "
                  alt="好友头像"
                  class="avatar"
                />
                <span>{{
                  friend.remark
                    ? friend.remark
                    : friend.name
                    ? friend.name
                    : friend.email
                }}</span>
              </div>
            </div>
            <div v-else class="friend-list">
              <h3 class="title-border">好友</h3>
              <p class="tip-text">还未添加好友哦，快去添加吧！</p>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <ContextMenu ref="contextMenu" @delete-contact="handleDeleteContact" />
    <GroupContextMenu
      ref="groupContextMenu"
      @delete-contact="handleDeleteContact"
    />
    <InBox ref="InBoxDialog" @handle-request="handleRequest" />
    <create-group-dialog ref="createGroupDialog"></create-group-dialog>
  </div>
</template>
<script>
import InBox from "../components/InBox.vue";
import ContextMenu from "../components/littleComponents/ContextMenu.vue";
import GroupContextMenu from "../components/littleComponents/GroupContextMenu.vue";
import axios from "axios";
import CreateGroupDialog from "../components/CreateGroupDialog.vue";
import {
  Message,
} from "@element-plus/icons-vue";

export default {
  name: "ContactsView",
  components: {
    InBox,
    ContextMenu,
    GroupContextMenu,
    CreateGroupDialog,
    Message,
  },
  data() {
    return {
      searchText: "", // 用于绑定搜索框的文本
      additionalMessage: "", // 用于绑定附加消息的文本
      groupChats: [],
      friends: [],
    };
  },
  created() {
    this.getFriends();
    this.getGroupChats(); // 调用获取群组列表的方法
  },
  methods: {
    handleRequest() {
      console.log("处理好友请求");
      this.getFriends();
      this.getGroupChats();
    },
    handleDeleteContact(chat) {
      console.log("删除好友或群组:", chat);
      // 根据 chat 对象的类型来决定是删除好友还是群组
      if (Object.prototype.hasOwnProperty.call(chat, "email")) {
        // 对象有 email 属性
        // 从 friends 数组中移除
        console.log("删除好友:", chat);
        this.friends = this.friends.filter((friend) => friend.id !== chat.id);
      } else {
        // 从 groupChats 数组中移除
        this.groupChats = this.groupChats.filter(
          (group) => group.id !== chat.id
        );
      }

      console.log(
        "删除操作完成，更新后的数据：",
        this.friends,
        this.groupChats
      );
    },
    openInBox() {
      this.$refs.InBoxDialog.open();
    },
    handleDblClick(object) {
      console.log("双击:", object);
      if (object.id) {
        this.$store.dispatch("setCurrentChat", object);
        this.$router.push("/home/chat");
      }
    },

    addFriend() {
      axios
        .post(
          "/user/friendRequest",
          {
            friendId: this.searchText,
            message: this.additionalMessage,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.data.code === 1) {
            console.log("好友申请成功:", response.data.msg);
            this.$message.success(response.data.msg);
          } else {
            console.error("好友申请失败:", response.data.msg);
            this.$message.error(response.data.msg);
          }
          // 清空搜索和附加消息
          this.searchText = "";
          this.additionalMessage = "";
        })
        .catch((error) => {
          console.error("好友申请请求失败:", error);
          let errorMsg =
            error.response && error.response.data && error.response.data.msg
              ? error.response.data.msg
              : "好友申请过程中出现错误";
          this.$message.error(errorMsg);
        });
    },

    joinGroup() {
      axios
        .post(
          "/group/joinGroup",
          {
            name: this.searchText,
            message: this.additionalMessage,
          },
          {
            withCredentials: true,
          }
        )
        .then((response) => {
          if (response.data.code === 1) {
            console.log("加入群聊成功:", response.data.msg);
            this.$message.success(response.data.msg);
          } else {
            console.error("加入群聊失败:", response.data.msg);
            this.$message.error(response.data.msg);
          }
          // 清空搜索和附加消息
          this.searchText = "";
          this.additionalMessage = "";
        })
        .catch((error) => {
          console.error("加入群聊请求失败:", error);
          let errorMsg =
            error.response && error.response.data && error.response.data.msg
              ? error.response.data.msg
              : "加入群聊过程中出现错误";
          this.$message.error(errorMsg);
        });
    },

    showFriendMenu(event, friend) {
      this.$store.dispatch("setCurrentChat", friend);
      this.$refs.contextMenu.open(event);
    },

    showGroupMenu(event, group) {
      this.$store.dispatch("setCurrentChat", group);
      this.$refs.groupContextMenu.open(event);
    },

    getFriends() {
      axios
        .get("/user/getAllFriendList", {}, { withCredentials: true })
        .then((response) => {
          if (response.data.code === 1) {
            this.friends = response.data.data;
          } else {
            console.error("获取好友列表失败:", response.data.msg);
          }
        })
        .catch((error) => {
          console.error("请求错误:", error);
        });
    },
    // 新增方法：获取群组列表
    getGroupChats() {
      axios
        .get("/group/getAllGroupList", { withCredentials: true })
        .then((response) => {
          if (response.data.code === 1) {
            this.groupChats = response.data.data;
          } else {
            console.error("获取群组列表失败:", response.data.msg);
            this.groupChats = []; // 如果失败，清空群组列表
          }
        })
        .catch((error) => {
          console.error("请求群组列表错误:", error);
        });
    },
    showCreateGroupDialog() {
      this.$refs.createGroupDialog.dialogVisible =
        !this.$refs.createGroupDialog.dialogVisible;
    },
  },
};
</script>
<style scoped>
.tip-text {
  text-align: center;
  color: #999;
  margin-top: 10px;
}

.title-border {
  border-bottom: 1px solid #ccc; /* Gray bottom border */
  padding-bottom: 5px; /* Optional: Adjust padding as needed */
}
.el-button .el-icon {
  margin-right: 10px; /* 或者您希望的任何间距值 */
}

/* 容器样式 */
.group-list, .friend-list {
  border: 1px solid #eaeaea;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 2%;
  padding: 10px;
  margin-bottom: 20px;
}

.contact-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
  user-select: none; /* 禁止选中文本 */
}
.contact-item:last-child {
  border-bottom: none;
}

.contact-item:hover {
  background-color: #f0f0f0; /* 鼠标悬停时的背景颜色 */
}

/* 文本样式 */
.contact-item span {
  font-size: 14px;
  color: #333;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f7f9fc; /* 浅灰色背景 */
  color: #333;
  padding: 15px 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-input,
.additional-message {
  border: 1px solid #d1d4da;
  border-radius: 4px;
  flex-grow: 1;
  margin-right: 10px;
}

.search-input {
  margin-right: 10px;
  margin-left: 10px;
}

.el-button {
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
}

.el-button:hover {
  opacity: 0.9;
}

/* 主题色按钮样式 */
.el-button--primary {
  background-color: #409eff; /* 蓝色 */
  color: white;
}

.el-button--success {
  background-color: #409eff; /* 蓝色 */
  color: white;
}
.el-button--success:hover {
  background-color: #7cb9f7; /* 蓝色 */
}

.el-button--info {
  background-color: #909399; /* 灰色 */
  color: white;
}



</style>
