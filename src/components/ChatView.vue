<template>
    <div class="chat-view">
      <ChatList />
      <div class="chat-display">
        <MessageDisplay />
        <TextInput />
      </div>
    </div>
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
  /* 聊天视图样式 */
  .chat-view {
    display: flex;
  }
  .chat-display {
    flex-grow: 1;
  }
  </style>
  