<template>
  <div class="text-input">
    <input
      type="text"
      v-model="message"
      placeholder="输入消息..."
      class="input-field"
      @keyup.enter="sendMessage"
    />
    <button @click="sendMessage" class="send-button">发送</button>
  </div>
</template>

<script>
import WebSocketService from "@/services/WebSocketService"; // 引入 WebSocket 服务

export default {
  data() {
    return {
      message: "", // 绑定到输入框的消息文本
    };
  },
  methods: {
    sendMessage() {
      if (this.message.trim() && this.$store.state.currentUser) {
        const chatMessage = {
          senderId: this.$store.state.currentUser.id, // 使用 Vuex store 中的当前用户ID
          senderName: this.$store.state.currentUser.name, // 使用 Vuex store 中的当前用户昵称
          receiverId: this.$store.state.currentChat.id, // 当前聊天对象ID
          receiverName: this.$store.state.currentChat.name, // 当前聊天对象昵称
          //如果email为空，说明是群聊receiverType=1否则为0
          receiverType: this.$store.state.currentChat.email ? 0 : 1,
          content: this.message,
          type: 0, // 假设 0 表示文本消息
        };

        WebSocketService.send(chatMessage);
        this.message = ""; // 发送后清空输入框
      }
    },
  },
};
</script>

<style scoped>
.text-input {
  /* 样式定义 */
  display: flex;
  padding: 10px;
  background-color: #eceff1;
}
.input-field {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ccc;
}
.send-button {
  padding: 5px 10px;
  background-color: #42a5f5;
  color: white;
  border: none;
  cursor: pointer;
}
.send-button:hover {
  background-color: #1e88e5;
}
</style>
