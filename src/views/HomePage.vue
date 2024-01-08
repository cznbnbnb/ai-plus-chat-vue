<template>
  <el-container style="height: 100vh">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu default-active="1">
        <el-menu-item index="1" @click="goTo('/chat')">聊天</el-menu-item>
        <el-menu-item index="2" @click="goTo('/contacts')">联系人</el-menu-item>
        <el-menu-item index="3" @click="goTo('/moments')">朋友圈</el-menu-item>
        <el-menu-item index="4" @click="goTo('/settings')">设置</el-menu-item>
        <el-menu-item index="5" @click="toggleAIDialog">AI对话</el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
    <AIDialogSidebar ref="aiDialog" />
  </el-container>
</template>

<script>
import AIDialogSidebar from "../components/AIDialogSidebar.vue";

export default {
  name: "HomePage",
  components: {
    AIDialogSidebar,
  },
  methods: {
    goTo(route) {
      this.$router.push({ path: `/home${route}` });
    },
    toggleAIDialog() {
      this.$refs.aiDialog.drawerVisible = !this.$refs.aiDialog.drawerVisible;
      this.$forceUpdate(); // 强制更新
    },
  },
};
</script>

<!-- 样式 -->

<style scoped>
/* 整体布局 */
.el-container {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 侧边栏样式 */
.el-aside {
  border-right: 1px solid #ebeef5;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
}

/* 菜单项样式 */
.el-menu {
  border: none;
}

.el-menu-item {
  color: #303133;
  font-size: 16px;
}

.el-menu-item:hover {
  background-color: #409eff;
  color: white;
}

/* 主内容区域 */
.el-main {
  background-color: white;
  padding: 20px;
  overflow-y: auto;
}
</style>
