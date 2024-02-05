<template>
  <el-drawer
    v-model="drawerVisible"
    direction="ltr"
    size="40%"
    :with-header="false"
    class="ai-drawer"
  >
    <div class="ai-header">
      <img src="@/assets/doge.png" alt="AI头像" class="ai-avatar" />
      <h3>AI助手</h3>
    </div>

    <div class="ai-dialog">
      <div class="dialog-history">
        <!-- AI回复 -->
        <p v-if="aiResponse" class="message-ai">{{ aiResponse }}</p>
        <!-- 用户消息 -->
        <p v-if="userMessage" class="message-user">{{ userMessage }}</p>
      </div>

      <div class="input-area">
        <el-input v-model="inputText" placeholder="输入消息..."></el-input>
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      drawerVisible: false,
      userMessage: "",
      aiResponse: "",
      inputText: "",
      failedAttempts: 0, // 添加失败尝试计数器
      pollInterval: null,
    };
  },
  methods: {
    sendMessage() {
      const message = this.inputText;
      this.inputText = ""; // 清空输入框
      this.aiResponse = ""; // 重置AI回应
      this.userMessage = message; // 显示用户消息
      axios
        .post("/ai/sendMessage", { message: message })
        .then((response) => {
          console.log("发送成功:", response.data);
          this.pollAnswer(); // 开始轮询获取AI回复
        })
        .catch((error) => {
          console.error("发送失败:", error);
          return;
        });
    },
    pollAnswer() {
      const poll = () => {
        axios
          .post("/ai/getAnswer")
          .then((response) => {
            if (response.data.code === 1) {
              this.failedAttempts = 0; // 重置失败尝试计数器
              this.aiResponse = response.data.data.answer;
              console.log("AI状态:", response.data.data.state);
              if (response.data.data.state === 2) {
                this.aiResponse = response.data.data.answer;
                console.log("AI回复完毕:");
                // AI回复完毕后停止轮询
                clearInterval(this.pollInterval);
              }
            } else {
              // 失败尝试计数器加1
              this.failedAttempts += 1;
              if (this.failedAttempts > 5) {
                // 失败尝试次数超过5次后停止轮询
                console.error("获取回复失败次数过多，停止轮询");
                clearInterval(this.pollInterval);
              }
            }
          })
          .catch((error) => {
            console.error("获取回复失败:", error);
            clearInterval(this.pollInterval);
          });
      };
      this.pollInterval = setInterval(poll, 3000);
    },
  },
  beforeUnmount() {
    clearInterval(this.pollInterval);
  },
};
</script>

<style scoped>
.ai-drawer {
  color: #333; /* 文字颜色 */
  background-color: #f9f9f9; /* 浅灰色背景 */
}

.ai-header {
  text-align: center;
  margin-bottom: 20px;
  background-color: #e8f4fd; /* 柔和蓝色调 */
  padding: 10px;
}

.ai-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 10px;
  border: 2px solid #b3c0d1; /* 淡蓝色边框 */
}

.dialog-history {
  overflow-y: auto;
  height: calc(100% - 180px);
  padding: 10px;
  background-color: white; /* 白色背景 */
  border: 1px solid #ebeef5; /* 淡灰色边框 */
}

.input-area {
  display: flex;
  padding: 10px;
  background-color: #e8f4fd; /* 柔和蓝色调 */
}

.input-message {
  flex-grow: 1;
  margin-right: 10px;
}

.send-button {
  min-width: 80px;
}

.message-user {
  text-align: right;
  background-color: #e8f4fd; /* 柔和的蓝色背景 */
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
  display: block;
  max-width: 70%;
  margin-left: auto; /* 保持右侧对齐 */
  clear: both; /* 清除浮动 */
}

.message-ai {
  text-align: left;
  background-color: #f9f9f9; /* 浅灰色背景 */
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
  display: block;
  max-width: 70%;
  clear: both; /* 清除浮动 */
}

.ai-dialog {
  display: flex;
  flex-direction: column;
  height: 80%;
}

.dialog-history {
  display: flex;
  flex-direction: column-reverse; /* 反转消息顺序 */
  overflow-y: auto;
  height: calc(100% - 180px);
  padding: 10px;
  background-color: white;
  border: 1px solid #ebeef5;
}
</style>
