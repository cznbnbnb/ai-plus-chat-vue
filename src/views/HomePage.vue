<template>
  <el-container class="home-page">
    <MouseTrail></MouseTrail> <!-- 这里插入鼠标轨迹组件 -->
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu default-active="1">
        <!-- 聊天 -->
        <el-menu-item index="1" @click="goTo('/chat')">
          <el-icon><chat-line-round /></el-icon>
          聊天
        </el-menu-item>

        <!-- 联系人 -->
        <el-menu-item index="2" @click="goTo('/contacts')">
          <el-icon><user /></el-icon>
          联系人
        </el-menu-item>

        <!-- 朋友圈 -->
        <el-menu-item index="3" @click="goTo('/moments')">
          <el-icon><share /></el-icon>
          朋友圈
        </el-menu-item>

        <!-- 设置 -->
        <el-menu-item index="4" @click="goTo('/settings')">
          <el-icon><setting /></el-icon>
          设置
        </el-menu-item>

        <!-- AI对话 -->
        <el-menu-item index="5" @click="toggleAIDialog">
          <el-icon><WalletFilled  /></el-icon>
          AI对话
        </el-menu-item>
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
import {
  ChatLineRound,
  User,
  Share,
  Setting,
  WalletFilled,
} from "@element-plus/icons-vue";
import MouseTrail from "../components/MouseTrail.vue";

export default {
  name: "HomePage",
  components: {
    MouseTrail,
    ChatLineRound,
    User,
    Share,
    Setting,
    WalletFilled,
    AIDialogSidebar, // 如果这是您自己的组件，请保持不变
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
.el-icon {
  size: 5em;
}
/* 整体布局 */
.el-container {
  display: flex; /* 使用弹性盒布局 */
  height: 98vh; /* 全高 */
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* 盒模型调整 */
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #d3d4d6; /* 灰色分割线 */

}

/* 侧边栏样式 */
.el-aside {
  width: 200px; /* 定义宽度 */
  height: 100%; /* 全高 */
  border-right: 1px solid #ebeef5;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.1);
  overflow-y: hidden; 
}

/* 菜单项样式 */
.el-menu {
  height: 100vh;
  border: none;
}

.el-menu-item {
  color: #303133;
  height: 20%;
  font-size: 16px;
  border-bottom: 1px solid #d3d4d6; /* 灰色分割线 */
}

.el-menu-item:last-child {
  border-bottom: none; /* 最后一个菜单项不需要分割线 */
}

.el-menu-item:hover {
  background-color: #409eff;
  color: white;
}

/* 主内容区域 */
.el-main {
  flex: 1; /* 占据剩余空间 */
  background-color: white;
  height: 98vh;
  padding: 0px;
  overflow-y: hidden;
}
</style>
