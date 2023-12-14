<template>
    <div class="moments-view">
      <el-container>
        <el-header>朋友圈</el-header>
        <el-main>
          <!-- 朋友圈动态列表 -->
          <div class="moment" v-for="moment in moments" :key="moment.id">
            <h3>{{ moment.user }}</h3>
            <p>{{ moment.content }}</p>
            <!-- 可以添加更多内容，如图片、评论等 -->
          </div>
        </el-main>
      </el-container>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MomentsView',
    data() {
      return {
        moments: [
          { id: 1, user: '张三', content: '今天天气不错！' },
          { id: 2, user: '李四', content: '出去旅行啦！' }
          // 更多动态...
        ]
      };
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
  
  .moments-view {
    padding: 20px;
  }
  
  .moment {
    border-bottom: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  </style>
  