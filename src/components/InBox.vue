<template>
  <el-dialog v-model="isVisible" title="收件箱" width="40%" class="InBox-dialog">
    <div v-if="friendRequests.length">
      <el-card class="request-card" shadow="hover" v-for="request in friendRequests" :key="request.id">
        <div class="request-content">
          <el-avatar :src="request.avatar ? request.avatar : require('@/assets/doge.png')"></el-avatar>
          <div class="request-info">
            <h4>{{ request.name }}</h4>
            <p>{{ request.message }}</p>
          </div>
        </div>
        <div class="request-actions">
          <el-button size="mini" @click="acceptRequest(request.id)">接受</el-button>
          <el-button size="mini" type="danger" @click="declineRequest(request.id)">拒绝</el-button>
        </div>
      </el-card>
    </div>
    <div v-else class="empty-InBox">
      <p>没有新的好友申请。</p>
    </div>
  </el-dialog>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      isVisible: false,
      friendRequests: [],
    };
  },
  methods: {
    open() {
      this.isVisible = true;
      this.getFriendRequests();
    },
    getFriendRequests() {
      axios.get('/user/getFriendRequest', { withCredentials: true })
        .then(response => {
          if (response.data.code === 1) {
            this.friendRequests = response.data.data;
          } else {
            console.error('获取好友申请列表失败:', response.data.msg);
          }
        })
        .catch(error => {
          console.error('获取好友申请列表失败:', error);
        });
    },
    acceptRequest(requestId) {
      this.handleFriendRequest(requestId, 1); // 假设 1 表示接受
    },
    declineRequest(requestId) {
      this.handleFriendRequest(requestId, 2); // 假设 2 表示拒绝
    },
    handleFriendRequest(requestId, type) {
      axios.post('/user/handleFriendRequest', { requestId, type })
        .then(response => {
          if (response.data.code === 1) {
            console.log('好友申请处理成功:', response.data);
            // 更新 friendRequests 列表或通知用户
            this.getFriendRequests(); // 刷新列表
          } else {
            console.error('好友申请处理失败:', response.data.msg);
          }
        })
        .catch(error => {
          console.error('好友申请处理失败:', error);
        });
    }
  }
};
</script>
  

<style scoped>
.InBox-dialog .request-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.request-content {
  display: flex;
  align-items: center;
}

.request-info {
  margin-left: 15px;
}

.request-actions {
  margin-left: auto;
}

.empty-InBox {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>