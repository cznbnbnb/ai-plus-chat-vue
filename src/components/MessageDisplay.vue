<template>
  <div class="message-display" ref="messageDisplay">
    <ul>
      <li v-for="message in filteredMessages" :key="message.id" :class="{
        'my-message': message.senderId === $store.state.currentUser.id,
        'other-message': message.senderId !== $store.state.currentUser.id,
      }">
        <!-- 图片消息 -->
        <img v-if="message.type === 1" :src="message.content" class="message-image" alt="图片" />

        <!-- 文本消息 -->
        <div v-else class="message-content">{{ message.content }}</div>

        <div class="message-info" :class="{
        'time-right': message.senderId === $store.state.currentUser.id,
        'time-left': message.senderId !== $store.state.currentUser.id,
      }">
          <span class="message-sender">{{ message.senderName }}</span>
          <span class="message-time">{{ formatTime(message.createTime) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "MessageDisplay",
  computed: {
    shouldScroll() {
      return this.$store.state.shouldScrollToBottom;
    },
    ...mapState(["messages", "currentUser", "currentChat"]),
    filteredMessages() {
      if (
        !this.currentChat ||
        !this.messages ||
        !Array.isArray(this.messages)
      ) {
        return [];
      }
      return this.messages.filter((message) => {
        return (
          message &&
          message.id &&
          (message.receiverId === this.currentChat.id ||
            message.senderId === this.currentChat.id)
        );
      });
    },
  },

  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageDisplay;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    formatTime(dateTimeObj) {
      if (!dateTimeObj) {
        return "";
      }

      // 检查 dateTimeObj 中的必要属性是否存在
      const { year, monthValue, dayOfMonth, hour, minute, second } =
        dateTimeObj;
      if (
        year === undefined ||
        monthValue === undefined ||
        dayOfMonth === undefined ||
        hour === undefined ||
        minute === undefined ||
        second === undefined
      ) {
        return dateTimeObj;
      }

      // 构造一个标准的日期时间字符串
      const dateTimeStr = `${year}-${monthValue
        .toString()
        .padStart(2, "0")}-${dayOfMonth.toString().padStart(2, "0")} ${hour
          .toString()
          .padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second
            .toString()
            .padStart(2, "0")}`;

      // 直接返回这个字符串
      return dateTimeStr;
    },

    handleScroll() {
      const container = this.$refs.messageDisplay;
      const threshold = 100; // 距离顶部多少像素时开始加载
      if (container.scrollTop < threshold) {
        this.currentPage++;
        this.loadMessages();
      }
    },

    loadMessages() {
      console.log("加载消息" + this.$store.state.currentChat.id);
      this.$store.dispatch("loadMessages", {
        friendId: this.$store.state.currentChat.id,
        page: this.currentPage,
        messageInstance: this.$message,
      });
    },
  },
  watch: {
    shouldScroll(newValue) {
      if (newValue) {
        console.log("shouldScroll变化:", newValue);
        setTimeout(() => {
          this.scrollToBottom();
        }, 300);
        this.$store.commit("SET_SHOULD_SCROLL_TO_BOTTOM", false);
      }
    },
    currentChat(newChat, oldChat) {
      console.log("当前聊天变化:", newChat, oldChat);
      if (newChat !== oldChat) {
        this.currentPage = 1; // 重置页码
        this.isFirstLoad = true;
        this.loadMessages(); // 加载新聊天的消息
      }
    },
    filteredMessages: function (newMessages) {
      if (this.isFirstLoad && newMessages.length > 0) {
        this.scrollToBottom();
        this.isFirstLoad = false; // 更新标志变量
      }
    },
    messages: function () {
      console.log("消息列表变化");
      this.scrollToBottom();
    },
  },
  mounted() {
    this.scrollToBottom();
    const container = this.$refs.messageDisplay;
    container.addEventListener("scroll", this.handleScroll);

    // 如果当前聊天对象已设置，则立即加载消息
    if (this.currentChat) {
      this.loadMessages();
    }
  },

  beforeUnmount() {
    // 清理事件监听器
    if (this.$refs.messageDisplay) {
      this.$refs.messageDisplay.removeEventListener(
        "scroll",
        this.handleScroll
      );
    }
  },
  data() {
    return {
      currentPage: 1,
      isFirstLoad: true, // 新增的标志变量
      // ...其他数据
    };
  },
};
</script>

<style scoped>
.message-display {
  padding: 10px;
  overflow-y: auto;
  /* 灰色边界线 */
  border: 3px solid #dbdde0;
  border-radius: 5px;
  height: 55vh;
}

.message-display ul {
  list-style: none;
  padding: 0;
}

.message-display li {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

.my-message {
  align-items: flex-end;
  /* 自己的消息靠右对齐 */
}

.other-message {
  align-items: flex-start;
  /* 朋友的消息靠左对齐 */
}

.message-content,
.message-image {
  border-radius: 10px;
  max-width: 80%;
  margin-bottom: 5px;
}

.message-content {
  padding: 5px 10px;
  background-color: #d3f9d8;
}

.other-message .message-content {
  background-color: #f0f0f0;
}

.message-image {
  max-width: 100px;
  /* 调整为所需大小 */
  height: auto;
}

.message-info {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  width: 100%;
}

.message-sender {
  margin-right: 10px;
  display: inline-block;
}

.message-info.time-right {
  text-align: right;
}

.message-info.time-left {
  text-align: left;
}

.message-time {
  display: inline-block;
}
</style>
