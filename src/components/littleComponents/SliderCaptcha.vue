<template>
    <div class="slider-captcha">
      <div class="captcha-container">
        <div class="slider-track" @click="checkCaptcha">
          <!-- 将文字移动到轨道上 -->
          <span class="slider-text">{{ message }}</span>
          <div class="slider-button" :style="{ left: buttonPosition + 'px' }" @mousedown="startDrag"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isDragging: false,
        startX: 0,
        buttonPosition: 0,
        isVerified: false,
        // 添加message数据来控制显示的文本
        message: "拖动滑块验证",
      };
    },
    methods: {
      startDrag(e) {
        this.isDragging = true;
        this.startX = e.clientX;
        document.addEventListener('mousemove', this.dragging);
        document.addEventListener('mouseup', this.endDrag);
      },
      dragging(e) {
        if (!this.isDragging) return;
        const moveX = e.clientX - this.startX;
        // 限制滑块移动范围，保持在轨道内
        this.buttonPosition = Math.max(0, Math.min(180, this.buttonPosition + moveX)); // 将最大值调整为轨道长度减去滑块长度
        this.startX = e.clientX;
      },
      endDrag() {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.dragging);
        document.removeEventListener('mouseup', this.endDrag);
        this.checkCaptcha();
      },
      checkCaptcha() {
        if (this.buttonPosition >= 170) { // 调整为轨道长度减去滑块长度的值
          this.isVerified = true;
          this.message = "验证成功!";
          this.$emit('verified', true)
        } else {
          this.buttonPosition = 0; // Reset
          this.message = "请重试"; // 更新消息为请重试
          setTimeout(() => this.message = "拖动滑块验证", 2000); // 2秒后重置消息
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .slider-captcha .captcha-container {
    user-select: none;
  }
  .slider-track {
    background-color: #eaeaea;
    width: 220px;
    height: 40px;
    position: relative;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 15px;
  }
  .slider-button {
    position: absolute;
    top: 5px; /* 轻微调整以居中 */
    left: 0;
    width: 30px; /* 缩小滑块 */
    height: 30px; /* 缩小滑块 */
    background-color: #4b99ff;
    border-radius: 15px; /* 调整为滑块的一半以保持圆形 */
    cursor: pointer;
  }
  .slider-text {
    color: #333;
    font-size: 14px;
    user-select: none;
  }
  </style>
  