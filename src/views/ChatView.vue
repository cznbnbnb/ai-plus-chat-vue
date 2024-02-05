<template>
  <el-container class="home-page">
    <el-aside class="chat-list">
      <ChatList />
    </el-aside>
    <el-main class="message-display-and-input">
      <MessageDisplay />
      <TextInput />
    </el-main>
  </el-container>
</template>
<script>
import ChatList from '../components/ChatList.vue';
import MessageDisplay from '../components/MessageDisplay.vue';
import TextInput from '../components/TextInput.vue';

export default {
  components: {
    ChatList,
    MessageDisplay,
    TextInput
  }
};
</script>

<style scoped>
.home-page {
  height: 100vh;
  padding: 0;
}
.chat-list {
  width: 20%;
  height: 100vh;
  background-color: #e6e6e6;
}

.message-display-and-input {
  width: 70%;
  padding: 0 20px;
  height: 100vh;
  overflow: hidden;
}
</style>
