<template>
  <el-dialog title="群成员管理" v-model="dialogVisible">
    <el-table :data="members" style="width: 100%">
      <el-table-column prop="avatar" label="头像">
        <template #default="scope">
          <el-avatar :src="scope.row.avatar"></el-avatar> <!-- 显示头像 -->
        </template>
      </el-table-column>
      <el-table-column prop="name" label="成员名"></el-table-column>
      <el-table-column label="操作" v-if="isUserAdmin">
        <template #default="scope">
          <el-button type="text" @click="removeMember(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>


<script>
import axios from "axios";

export default {
  computed: {
  groupId() {
    return this.$store.state.currentChat.id;
  },
  currentUser() {
    return this.$store.state.currentUser.id;
  },
  isUserAdmin() {
    return this.$store.state.currentUser.id === this.$store.state.currentChat.ownerId;
  },
},

  name: "GroupMembersDialog",
  data() {
    return {
      dialogVisible: false,
      members: [],
    };
  },
  methods: {
    open() {
      this.dialogVisible = true;
      this.loadMembers();
    },
    loadMembers() {
      // 使用新的接口获取群成员列表
      axios.get(`/group/getGroupMemberList`, {
        params: { groupId: this.groupId }
      }).then((response) => {
        if (response.data.code === 1) {
          this.members = response.data.data;
        } else {
          // 处理错误情况
          this.$message.error(response.data.msg || "加载群成员失败");
        }
      }).catch(error => {
        // 处理请求错误
        this.$message.error(error.message || "加载群成员时出现错误");
      });
    },
    removeMember(member) {
      // 使用新的接口移除群成员
      axios.post("/group/removeUser", {
        groupId: this.groupId.toString(),
        removeUserId: member.id.toString()
      }).then((response) => {
        if (response.data.code === 1) {
          this.loadMembers();
        } else {
          this.$message.error(response.data.msg || "移除失败");
        }
      }).catch(error => {
        // 处理请求错误
        this.$message.error(error.message || "移除群成员时出现错误");
      });
    },
  },
};
</script>
