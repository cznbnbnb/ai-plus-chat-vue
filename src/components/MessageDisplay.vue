<template>
  <div class="message-display" ref="messageDisplay">
    <ul>
      <li
        v-for="message in filteredMessages"
        :key="message.id"
        :class="{
          'my-message': message.senderId === $store.state.currentUser.id,
          'other-message': message.senderId !== $store.state.currentUser.id,
        }"
      >
        <div class="message-content">{{ message.content }}</div>
        <div
          class="message-info"
          :class="{
            'time-right': message.senderId === $store.state.currentUser.id,
            'time-left': message.senderId !== $store.state.currentUser.id,
          }"
        >
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
        this.$store.dispatch("loadMessages", {
          friendId: this.currentChat.id,
          page: this.currentPage,
        });
      }
    },
  },

  mounted() {
    const container = this.$refs.messageDisplay;
    container.addEventListener("scroll", this.handleScroll);
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
  created() {
    if (this.currentChat && this.currentChat.id) {
      console.log("加载消息"+this.currentPage);
      this.$store.dispatch("loadMessages", {
        friendId: this.currentChat.id,
        page: this.currentPage,
      });
    }
  },
  data() {
    return {
      currentPage: 1, // 当前页码
      // ...其他数据
    };
  },
};
</script>

<style scoped>
.message-display {
  padding: 10px;
  overflow-y: auto;
  height: 400px;
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
  align-items: flex-end; /* 自己的消息靠右对齐 */
}

.my-message .message-content {
  background-color: #d3f9d8;
}

.other-message {
  align-items: flex-start; /* 朋友的消息靠左对齐 */
}

.other-message .message-content {
  background-color: #f0f0f0;
}

.message-content {
  padding: 5px 10px;
  border-radius: 10px;
  max-width: 80%;
}

.message-info {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  text-align: right; /* 时间信息靠右对齐 */
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
