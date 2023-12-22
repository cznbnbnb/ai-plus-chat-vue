
<template>
  <div class="contacts-view">
    <el-container>
      <el-header>
        <el-input placeholder="搜索好友..." v-model="searchText" class="search-input" />
        <el-input placeholder="附加消息..." v-model="additionalMessage" class="additional-message" />
        <el-button type="primary" icon="el-icon-search" @click="addFriend">添加好友</el-button>
        <el-button type="info" icon="el-icon-message" @click="openInBox">收件箱</el-button>
      </el-header>
      <el-main>
        <div class="contact-list">
          <h3>群聊</h3>
          <div v-for="group in groupChats" :key="group.id" class="contact-item"
            @contextmenu.prevent="showMenu($event, group)">
            <img :src="group.avatar ? group.avatar : require('@/assets/doge.png')" alt="群聊头像" class="avatar">
            <span>{{ group.name }}</span>
          </div>

          <h3>好友</h3>
          <div v-for="friend in friends" :key="friend.id" class="contact-item"
            @contextmenu.prevent="showMenu($event, friend)">
            <img :src="friend.avatar ? friend.avatar : require('@/assets/doge.png')" alt="好友头像" class="avatar">
            <span>{{ friend.name }}</span>
            <span>{{ friend.email }}</span>
          </div>
        </div>
      </el-main>
    </el-container>

    <ContextMenu ref="contextMenu" />
    <InBox ref="InBoxDialog" />
  </div>
</template>
<script>
import InBox from '../components/InBox.vue';
import ContextMenu from '../components/ContextMenu.vue';
import axios from 'axios';

export default {
  components: {
    InBox,
    ContextMenu
  },
  data() {
    return {
      searchText: '', // 用于绑定搜索框的文本
      additionalMessage: '', // 用于绑定附加消息的文本
      groupChats: [
        { id: 1, name: '群聊1', avatar: require('@/assets/doge.png') },
        { id: 2, name: '群聊2', avatar: require('@/assets/doge.png') }
        // 更多群聊数据...
      ],
      friends: []
    };
  },
  created() {
    this.getFriends();
  },
  methods: {
    openInBox() {
      this.$refs.InBoxDialog.open();
    },
    addFriend() {
      axios.post('/user/friendRequest', {
        friendId: this.searchText,
        message: this.additionalMessage
      }, {
        withCredentials: true
      })
        .then(response => {
          console.log('好友申请成功:', response.data);
          // 可以清空搜索和附加消息
          this.searchText = '';
          this.additionalMessage = '';
        })
        .catch(error => {
          console.error('好友申请失败:', error);
        });
    },
    showMenu(event) {
      // 使用 event，但暂时不使用 contact
      this.$refs.contextMenu.open(event);
    },
    getFriends() {
      axios.get('/user/getAllFriendList', {}, { withCredentials: true })
        .then(response => {
          if (response.data.code === 1) {
            this.friends = response.data.data;
          } else {
            console.error('获取好友列表失败:', response.data.msg);
          }
        })
        .catch(error => {
          console.error('请求错误:', error);
        });
    }
  }
};
</script>
<style scoped>
.el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #b3c0d1;
  color: white;
  padding: 15px 30px; /* 调整了内边距 */
}

.search-input,
.additional-message {
  margin-right: 10px; /* 添加外边距，使输入框之间有间隔 */
  flex-grow: 1; /* 使输入框自适应宽度 */
}

.additional-message {
  margin-left: 10px; /* 为附加消息输入框添加左侧外边距 */
}

.contact-list {
  padding: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>