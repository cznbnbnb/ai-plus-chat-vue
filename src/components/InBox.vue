<template>
    <el-dialog :visible="isVisible" title="收件箱" width="40%" class="InBox-dialog">
      <el-list border v-if="friendRequests.length">
        <el-card class="request-card" shadow="hover" v-for="request in friendRequests" :key="request.id">
          <div class="request-content">
            <el-avatar :src="request.avatar"></el-avatar>
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
      </el-list>
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
        // 假设后端API是 '/api/friend-requests'
        axios.get('/api/friend-requests', { withCredentials: true })
          .then(response => {
            this.friendRequests = response.data;
          })
          .catch(error => {
            console.error('获取好友申请列表失败:', error);
          });
      },
      acceptRequest(id) {
        // 处理接受请求逻辑
      },
      declineRequest(id) {
        // 处理拒绝请求逻辑
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
  