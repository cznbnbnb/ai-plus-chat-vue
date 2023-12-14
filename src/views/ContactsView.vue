
  <template>
    <div class="contacts-view">
      <el-container>
        <el-header>
          <el-input placeholder="搜索好友..." class="search-input" />
          <el-button type="primary" icon="el-icon-search">添加好友</el-button>
          <el-button type="info" icon="el-icon-message" @click="openInbox">收件箱</el-button>
        </el-header>
        <el-main>
          <div class="contact-list">
            <h3>群聊</h3>
            <div v-for="group in groupChats" :key="group.id" class="contact-item" @contextmenu.prevent="showMenu($event, group)">
              <img :src="group.avatar" alt="群聊头像" class="avatar">
              <span>{{ group.name }}</span>
            </div>
  
            <h3>好友</h3>
            <div v-for="friend in friends" :key="friend.id" class="contact-item" @contextmenu.prevent="showMenu($event, friend)">
              <img :src="friend.avatar" alt="好友头像" class="avatar">
              <span>{{ friend.name }}</span>
            </div>
          </div>
        </el-main>
      </el-container>
  
      <ContextMenu ref="contextMenu" />
      <Inbox ref="inboxDialog" />
    </div>
  </template>
  <script>
  import InBox from '../components/InBox.vue';
  import ContextMenu from '../components/ContextMenu.vue';
  
  export default {
    components: {
      Inbox,
      ContextMenu
    },
    data() {
      return {
        groupChats: [
          { id: 1, name: '群聊1', avatar: require('@/assets/doge.png') },
          { id: 2, name: '群聊2', avatar: require('@/assets/doge.png') }
          // 更多群聊数据...
        ],
        friends: [
          { id: 1, name: '张三', avatar: require('@/assets/doge.png') },
          { id: 2, name: '李四', avatar: require('@/assets/doge.png') }
          // 更多好友数据...
        ]
      };
    },
    methods: {
      openInbox() {
        this.$refs.inboxDialog.open();
      },
      addFriend() {
        // 处理添加好友的逻辑
      },
      showMenu(event) {
      // 使用 event，但暂时不使用 contact
      this.$refs.contextMenu.open(event);
      }
    }
  };
  </script>
  <style scoped>
  .el-header {
    background-color: #b3c0d1;
    color: white;
    padding: 30px;
    text-align: center;
  }
  
  .contacts-view {
    padding: 20px;
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

  .contacts-view .el-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.search-input {
  flex: 1;
  margin-right: 10px;
}
  </style>
  