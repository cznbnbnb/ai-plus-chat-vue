<template>
  <el-dialog
    v-model="isVisible"
    title="收件箱"
    width="40%"
    class="InBox-dialog"
  >
    <div v-if="friendRequests.length">
      <!-- 申请列表展示 -->
      <el-card
        class="request-card"
        shadow="hover"
        v-for="request in friendRequests"
        :key="request.id"
      >
        <div class="request-content">
          <!-- 如果是群组申请，则展示群头像和申请人头像 -->
          <div v-if="request.groupName" class="group-request">
            <el-avatar
              :src="
                request.avatar ? request.avatar : require('@/assets/doge.png')
              "
            ></el-avatar>
            <el-avatar
              :src="
                request.groupAvatar
                  ? request.groupAvatar
                  : require('@/assets/doge.png')
              "
            ></el-avatar>
            <div class="request-info">
              <h4>{{ request.name }} 申请加入 {{ request.groupName }}</h4>
              <p>{{ request.message }}</p>
            </div>
          </div>
          <!-- 如果是好友申请，则只展示申请人头像 -->
          <div v-else class="friend-request">
            <el-avatar
              :src="
                request.avatar ? request.avatar : require('@/assets/doge.png')
              "
            ></el-avatar>
            <div class="request-info">
              <h4>{{ request.name }}</h4>
              <p>{{ request.message }}</p>
            </div>
          </div>
        </div>
        <div class="request-actions">
          <!-- 接受和拒绝按钮 -->
          <el-button
            size="mini"
            @click="
              handleRequest(request.id, 1, request.groupName ? true : false)
            "
            >接受</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="
              handleRequest(request.id, 2, request.groupName ? true : false)
            "
            >拒绝</el-button
          >
        </div>
      </el-card>
    </div>
    <div v-else class="empty-InBox">
      <p>没有新的申请。</p>
    </div>
  </el-dialog>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isVisible: false,
      friendRequests: [], // 用于存储好友和群组申请
    };
  },
  methods: {
    open() {
      this.isVisible = true;
      this.getFriendRequests();
    },
    getFriendRequests() {
      axios
        .get("/user/getFriendRequest", { withCredentials: true })
        .then((response) => {
          if (response.data.code === 1) {
            this.friendRequests = response.data.data;
          } else {
            console.error("获取好友申请列表失败:", response.data.msg);
          }
        })
        .catch((error) => {
          console.error("获取好友申请列表失败:", error);
        });
    },
    handleRequest(requestId, type, isGroup) {
      const url = isGroup
        ? "/group/handleGroupRequest"
        : "/user/handleFriendRequest";
      axios
        .post(url, { requestId, type })
        .then((response) => {
          if (response.data.code === 1) {
            console.log("申请处理成功:", response.data);
            // 从列表中移除已处理的申请
            this.friendRequests = this.friendRequests.filter(
              (request) => request.id !== requestId
            );
            // 触发更新，例如重新获取好友列表
            this.$emit("handle-request");
          } else {
            console.error("申请处理失败:", response.data.msg);
          }
        })
        .catch((error) => {
          console.error("申请处理失败:", error);
        });
    },
  },
};
</script>

<style scoped>
.InBox-dialog .request-card {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  padding: 10px;
}

.request-content {
  display: flex;
  align-items: center;
}

.group-request .el-avatar,
.friend-request .el-avatar {
  margin-right: 10px;
  border: 1px solid #ccc;
}

.group-request {
  display: flex;
  align-items: center;
}

.request-info {
  margin-left: 15px;
  flex-grow: 1;
}

.request-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.empty-InBox {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>
