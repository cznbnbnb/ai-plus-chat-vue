import store from "../store";

class WebSocketService {
  constructor() {
    this.socket = null;
  }

  connect(url) {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      // 可以在这里发送一些初始化信息，比如用户的认证信息
    };

    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WebSocket message received:", message);
      // 处理接收到的消息
      this.handleMessage(message);
    };

    this.socket.onclose = (event) => {
      console.log("WebSocket disconnected:", event);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  send(message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected.");
    }
  }

  handleMessage(message) {
    store.dispatch("receiveMessage", message);
    console.log("到达handleMessage");
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

export default new WebSocketService();
