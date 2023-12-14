
<template>
    <el-container style="height: 100vh;">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246);">
        <el-menu default-active="1">
          <el-menu-item index="1" @click="goTo('/chat')">聊天</el-menu-item>
          <el-menu-item index="2" @click="goTo('/contacts')">联系人</el-menu-item>
          <el-menu-item index="3" @click="goTo('/moments')">朋友圈</el-menu-item>
          <el-menu-item index="4" @click="toggleAIDialog">AI对话</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
      <AIDialogSidebar ref="aiDialog" />
    </el-container>
  </template>
  
  <script>
  import AIDialogSidebar from '../components/AIDialogSidebar.vue';
  
  export default {
    name: 'HomePage',
    components: {
      AIDialogSidebar
    },
    methods: {
      goTo(route) {
        this.$router.push({ path: `/home${route}` });
      },
      toggleAIDialog() {
        this.$refs.aiDialog.drawerVisible = !this.$refs.aiDialog.drawerVisible;
        this.$forceUpdate(); // 强制更新
      }
    }
  };
  </script>
  
  <!-- 样式 -->
  
    
    <style scoped>
    /* 在这里添加您的样式 */
    </style>
    