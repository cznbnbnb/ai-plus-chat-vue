import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    currentUser: null, // 当前用户信息
    currentChat: null, // 当前聊天对象信息
    messages: [], // 聊天消息列表
    isAllMessagesLoaded: false, // 是否已加载所有历史消息
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
    },
    ADD_HISTORY_MESSAGES(state, historyMessages) {
      // 将历史消息添加到数组的开头
      state.messages.unshift(...historyMessages.reverse());
    },
    SET_ALL_MESSAGES_LOADED(state, value) {
      state.isAllMessagesLoaded = value;
    },
  },
  actions: {
    // 更新当前用户信息
    setCurrentUser({ commit }, user) {
      commit("SET_CURRENT_USER", user);
    },
    // 更新当前聊天对象信息
    setCurrentChat({ commit }, chat) {
      commit("SET_CURRENT_CHAT", chat);
    },
    // 接收新消息
    receiveMessage({ commit }, message) {
      commit("RECEIVE_MESSAGE", message);
    },
    loadMessages({ commit, state }, { friendId, page }) {
      if (state.isAllMessagesLoaded) {
        console.log("所有历史消息已加载");
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
