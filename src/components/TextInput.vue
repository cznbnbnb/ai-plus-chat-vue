<template>
  <div class="text-input">
    <input type="text" v-model="message" placeholder="输入消息..." class="input-field"/>
    <button @click="sendMessage" class="send-button">发送</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: '' // 绑定到输入框的消息文本
    };
  },
  methods: {
    sendMessage() {
      // 发送消息的逻辑，例如 emit 一个事件
      this.$emit('message-sent', this.message);
      this.message = ''; // 发送后清空输入框
    }
  }
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
