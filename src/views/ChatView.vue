<template>
    <el-container>
      <el-aside width="200px">
        <ChatList />
      </el-aside>
      <el-main>
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
  /* 在这里添加您的样式 */
  </style>
  