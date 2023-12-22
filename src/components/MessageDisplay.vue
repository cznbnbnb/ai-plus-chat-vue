<template>
  <div class="message-display">
    <ul>
      <li v-for="message in messages" :key="message.id" :class="{'my-message': message.isMine, 'other-message': !message.isMine}">
        <div class="message-content">{{ message.content }}</div>
        <div class="message-info">
          <span class="message-sender">{{ message.senderName }}</span>
          <span class="message-time">{{ formatTime(message.createTime) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'MessageDisplay',
  data() {
    return {
      messages: [] // 聊天消息数组
    };
  },
  methods: {
    formatTime(dateTime) {
      // 格式化时间的方法
    }
  }
};
</script>

<style scoped>
.message-display {
  /* 消息展示区域样式 */
  padding: 10px;
  overflow-y: auto;
  height: 400px; /* 可调整 */
}

.message-display ul {
  list-style: none;
  padding: 0;
}

.message-display li {
  margin-bottom: 10px;
}

.my-message .message-content {
  background-color: #d3f9d8;
}

.other-message .message-content {
  background-color: #f0f0f0;
}

.message-content {
  padding: 5px 10px;
  border-radius: 10px;
  display: inline-block;
}

.message-info {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

.message-sender {
  margin-right: 10px;
}

.message-time {
  float: right;
}
</style>
