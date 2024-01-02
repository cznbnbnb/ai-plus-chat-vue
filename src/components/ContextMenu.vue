<template>
  <div v-if="visible" class="context-menu" :style="styleObject">
    <el-menu>
      <el-menu-item @click="chat">进行聊天</el-menu-item>
      <el-menu-item @click="viewProfile">查看资料</el-menu-item>
      <el-menu-item @click="deleteChat">删除聊天</el-menu-item>
      <el-menu-item @click="blockContact">屏蔽联系人</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "ContextMenu",
  data() {
    return {
      visible: false,
      styleObject: {
        position: "fixed",
        left: "0px",
        top: "0px",
      },
    };
  },
  methods: {
    open(event) {
      event.preventDefault();
      this.visible = true;
      this.styleObject.left = `${event.clientX}px`;
      this.styleObject.top = `${event.clientY}px`;
    },
    close() {
      this.visible = false;
    },
    viewProfile() {
      // 查看资料逻辑
      this.close();
    },
    deleteChat() {
      // 删除聊天逻辑
      this.close();
    },
    blockContact() {
      // 屏蔽联系人逻辑
      this.close();
    },
    chat() {
      this.$store.dispatch("setCurrentChat", this.$store.state.currentChat);
      this.$router.push("/home/chat");
      this.close();
    },
  },
};
</script>

<style scoped>
.context-menu {
  z-index: 1000; /* 确保菜单在最上层 */
  border: 1px solid #ccc;
  background-color: white;
}

.el-menu {
  border: none; /* 移除Element UI默认边框 */
}
</style>
