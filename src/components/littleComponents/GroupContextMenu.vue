<template>
  <div v-if="visible" class="context-menu" :style="styleObject">
    <el-menu>
      <el-menu-item @click="chat">进行聊天</el-menu-item>
      <el-menu-item @click="prepareGroupAction">{{
        groupActionLabel
      }}</el-menu-item>
      <el-menu-item @click="prepareGroupControl">{{
        groupControlLabel
      }}</el-menu-item>
    </el-menu>
  </div>
  <ConfirmationDialog
    v-model="isDialogVisible"
    :message="confirmMessage"
    @confirm="onConfirm"
    @cancel="onCancel"
  />
  <group-members-dialog ref="groupMembersDialog"></group-members-dialog>
</template>

<script>
import axios from "axios";
import ConfirmationDialog from "./ConfirmationDialog.vue"; // 导入组件
import GroupMembersDialog from './GroupMembersDialog.vue';

export default {
  components: {
    ConfirmationDialog, // 注册组件
    GroupMembersDialog,
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
  name: "GroupContextMenu",
  data() {
    return {
      visible: false,
      isDialogVisible: false,
      confirmMessage: "您确定要执行这个操作吗？",
      currentAction: "",
      styleObject: {
        position: "fixed",
        left: "0px",
        top: "0px",
      },
    };
  },
  computed: {
    groupControlLabel() {
      // 判断用户是否为群管理员，以显示不同的选项
      return this.isUserAdmin ? "管理群成员" : "查看群成员";
    },
    groupActionLabel() {
      // 判断用户是否为群管理员，以显示不同的选项
      return this.isUserAdmin ? "解散群聊" : "退出群聊";
    },
    isUserAdmin() {
      return (
        this.$store.state.currentUser.id ===
        this.$store.state.currentChat.ownerId
      );
    },
  },
  methods: {
    openGroupMembersDialog() {
      this.$refs.groupMembersDialog.open();
    },
    open(event) {
      event.preventDefault();
      this.visible = true;
      this.styleObject.left = `${event.clientX}px`;
      this.styleObject.top = `${event.clientY}px`;
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.close();
      }
    },
    close() {
      this.visible = false;
    },
    prepareGroupAction() {
      this.currentAction = this.isUserAdmin ? "disbandGroup" : "leaveGroup";
      this.confirmMessage = this.isUserAdmin
        ? "您确定要解散这个群聊吗？"
        : "您确定要退出这个群聊吗？";
      this.isDialogVisible = true;
      this.close();
    },
    prepareGroupControl() {
      this.openGroupMembersDialog();
      this.close();
    },
    onConfirm() {
      if (this.currentAction === "disbandGroup") {
        this.disbandGroup();
      } else if (this.currentAction === "leaveGroup") {
        this.leaveGroup();
      }
      this.isDialogVisible = false;
      this.currentAction = "";
    },

    disbandGroup() {
      // 解散群聊的逻辑
      axios
        .post("/group/deleteGroup", { groupId: this.$store.state.currentChat.id })
        .then((response) => {
          if (response.data.code === 1) {
            console.log("解散群聊成功", response.data.msg);
            // 通知父组件
            this.$emit("delete-contact", this.$store.state.currentChat);
            this.$store.state.currentChat = null;
          } else {
            console.error("解散群聊失败:", response.data.msg);
            // 显示错误消息
            this.$message.error(response.data.msg);
          }
        })
        .catch((error) => {
          console.error("解散群聊请求失败:", error);
          // 显示错误消息
          this.$message.error("解散群聊过程中出现错误");
        });
    },

    leaveGroup() {
      // 退出群聊的逻辑
      axios
        .post("/group/removeUser", {
          groupId: this.$store.state.currentChat.id,
          removeUserId: this.$store.state.currentUser.id,
        })
        .then((response) => {
          if (response.data.code === 1) {
            console.log("退出群聊成功", response.data.msg);
            // 通知父组件
            this.$emit("delete-contact", this.$store.state.currentChat);
            this.$store.state.currentChat = null;
          } else {
            console.error("退出群聊失败:", response.data.msg);
            // 显示错误消息
            this.$message.error(response.data.msg);
          }
        })
        .catch((error) => {
          console.error("退出群聊请求失败:", error);
          // 显示错误消息
          this.$message.error("退出群聊过程中出现错误");
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
      this.currentAction = "";
    },
  },
};
</script>

<style scoped>
.context-menu {
  z-index: 1000;
  border: 1px solid #ccc;
  background-color: white;
}

.el-menu {
  border: none;
}
</style>
