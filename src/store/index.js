import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    currentUser: null, // 当前用户信息
    currentChat: null, // 当前聊天对象信息
    messages: [], // 聊天消息列表
    isAllMessagesLoaded: false, // 是否已加载所有历史消息
    shouldScrollToBottom: false, // 是否应该滚动到底部
    lastReminderTime: 0, // 上次提醒时间
  },
  mutations: {
    // 设置当前用户
    SET_CURRENT_USER(state, user) {
      state.currentUser = user;
      console.log("1", state.currentUser);
    },
    // 设置当前聊天对象
    SET_CURRENT_CHAT(state, chat) {
      state.currentChat = chat;
      console.log("2", state.currentChat);
    },
    // 接收新消息
    RECEIVE_MESSAGE(state, message) {
      state.messages.push(message);
      //打印消息内容
      console.log("3", state.messages);
    },
    CLEAR_MESSAGES(state) {
      state.messages = [];
      state.isAllMessagesLoaded = false;
    },
    ADD_HISTORY_MESSAGES(state, historyMessages) {
      // 将历史消息添加到数组的开头
      state.messages.unshift(...historyMessages.reverse());
    },
    SET_ALL_MESSAGES_LOADED(state, value) {
      state.isAllMessagesLoaded = value;
    },
    SET_CURRENT_PAGE(state, value) {
      state.currentPage = value;
    },
    SET_SHOULD_SCROLL_TO_BOTTOM(state, value) {
      console.log("4", state.shouldScrollToBottom);
      state.shouldScrollToBottom = value;
    },
  },
  actions: {
    clearMessages({ commit }) {
      commit("CLEAR_MESSAGES");
    },
    // 更新当前用户信息
    setCurrentUser({ commit }, user) {
      commit("SET_CURRENT_USER", user);
    },
    // 更新当前聊天对象信息
    setCurrentChat({ commit }, chat) {
    //如果新的聊天对象和当前聊天对象相同，则不做任何操作
    if (chat && chat.id === this.state.currentChat?.id) {
      return;
    }

      console.log("更新当前聊天对象信息", chat);
      commit("CLEAR_MESSAGES");
      commit("SET_CURRENT_CHAT", chat);
    },
    // 接收新消息
    receiveMessage({ commit }, message) {
      commit("RECEIVE_MESSAGE", message);
    },
    loadMessages({ commit, state }, { friendId, page, messageInstance}) {
      if (state.isAllMessagesLoaded) {
        let currentTime = Date.now();
        if (currentTime - state.lastReminderTime > 3000) {
          messageInstance({ type: "info", message: "已加载所有聊天记录" });
          state.lastReminderTime = currentTime; // 更新上次提醒时间
        }
        return;
      }
      axios
        .get("/chat/getMessage", {
          params: { friendId, page, limit: 30 },
        })
        .then((response) => {
          if (response.data.code === 1) {
            const records = response.data.data.records;
            if (records.length > 0) {
              commit("ADD_HISTORY_MESSAGES", records);
            } else {
              // 当返回的记录为空时，标记所有消息已加载
              commit("SET_ALL_MESSAGES_LOADED", true);
            }
          } else {
            console.error("获取历史消息失败:", response.data.msg);
          }
        })
        .catch((error) => {
          console.error("请求历史消息时发生错误:", error);
        });
    },

  },
  modules: {
    // 其他 Vuex 模块（如果有）
  },
});
