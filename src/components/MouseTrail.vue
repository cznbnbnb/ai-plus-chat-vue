<template>
    <div id="trailContainer" class="trail-container">
      <div v-for="(pixal, index) in pixalData" :key="index" class="pixal" :style="pixalStyle(pixal)"></div>
    </div>
  </template>
  
  <style scoped>
  .trail-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999999999;
    pointer-events: none; /* 允许鼠标事件穿透容器 */
  }
  
  .pixal {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
  }
  </style>
<script>
export default {
  data() {
    return {
      pixalData: [],
      pixalLife: 150, // 可以根据需要调整生命周期
      animationFrameId: null,
      gravity: 0.05, // 重力加速度，这个值可以根据效果需求调整
    };
  },
  mounted() {
    window.addEventListener('mousemove', this.createParticle);
    this.animate();
  },
  beforeUnmount() {
    window.removeEventListener('mousemove', this.createParticle);
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  },
  methods: {
    animate() {
      this.draw();
      this.animationFrameId = requestAnimationFrame(this.animate);
    },
    createParticle(evt) {
      this.pixalData.push({
        age: 0,
        color: `rgba(${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)}, ${parseInt(Math.random() * 255)}, ${Math.random()})`,
        vx: (Math.random() * 1 - 0.5) * 2, // 水平速度
        vy: (Math.random() * 1.5 - 0.75) * 2, // 垂直速度，初速度包含向上和向下的部分
        sx: evt.clientX,
        sy: evt.clientY,
      });
    },
    draw() {
      this.pixalData.forEach((pixal, i) => {
        pixal.age++;
        pixal.vx *= 0.99; // 可选：添加一点空气阻力使速度逐渐减慢
        pixal.vy += this.gravity; // 模拟重力影响，使垂直速度逐渐增加
        pixal.sx += pixal.vx;
        pixal.sy += pixal.vy;
        if (pixal.age >= this.pixalLife) {
          this.pixalData.splice(i, 1);
        }
      });
    },
    pixalStyle(pixal) {
      return {
        left: `${pixal.sx}px`,
        top: `${pixal.sy}px`,
        background: pixal.color,
      };
    },
  },
}
</script>

  