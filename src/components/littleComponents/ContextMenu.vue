<template>
  <div v-if="visible" class="context-menu" :style="styleObject">
    <el-menu>
      <el-menu-item @click="chat">进行聊天</el-menu-item>
      <el-menu-item @click="prepareDeleteContact">删除联系人</el-menu-item>
    </el-menu>
  </div>
  <ConfirmationDialog
    v-model="isDialogVisible"
    :message="confirmMessage"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
</template>

<script>
import axios from "axios";
import ConfirmationDialog from "./ConfirmationDialog.vue"; // 导入组件
export default {
  components: {
    ConfirmationDialog, // 注册组件
  },
  mounted() {
    // 在组件挂载后添加全局的 click 事件监听器
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    // 在组件销毁前移除全局的 click 事件监听器
    document.removeEventListener("click", this.handleClickOutside);
  },
  name: "ContextMenu",
  data() {
    return {
      visible: false,
      isDialogVisible: false, // 是否显示弹窗
      confirmMessage: "您确定要执行这个操作吗？", // 弹窗消息
      currentAction: "", // 当前需要确认的操作类型
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
    handleClickOutside(event) {
      // 检查点击事件的目标是否是这个组件
      if (!this.$el.contains(event.target)) {
        // 如果不是，关闭这个组件
        this.close();
      }
    },
    close() {
      this.visible = false;
    },
    prepareDeleteContact() {
      this.currentAction = "deleteContact";
      this.confirmMessage = "您确定要删除这个联系人吗？";
      this.isDialogVisible = true;
      this.close();
    },

    onConfirm() {
      if (this.currentAction === "deleteContact") {
        this.deleteContact();
      }
      // 可以添加更多的确认操作分支
      this.isDialogVisible = false;
      this.currentAction = ""; // 重置当前操作
    },

    deleteContact() {
      // 实现删除联系人的逻辑
      if (!this.$store.state.currentChat.id) {
        console.error("当前没有选中的联系人");
        return;
      }
      axios
        .post("/user/deleteContact", {
          contactId: this.$store.state.currentChat.id,
        })
        .then((response) => {
          if (response.data.code === 1) {
            console.log("联系人已删除");
            // 通知父组件
            this.$emit("delete-contact", this.$store.state.currentChat);
            this.$store.state.currentChat = null;
          } else {
            console.error("删除联系人失败:", response.data.msg);
          }
        })
        .catch((error) => {
          console.error("删除联系人失败:", error);
        });
    },
    chat() {
      this.$store.dispatch("setCurrentChat", this.$store.state.currentChat);
      this.$router.push("/home/chat");
      this.close();
    },

    onCancel() {
      console.log("操作已取消");
      this.isDialogVisible = false;
      this.$store.state.currentChat = null;
      this.currentAction = ""; // 重置当前操作
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
