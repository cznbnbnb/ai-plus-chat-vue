<template>
  <el-dialog v-model="isVisible" title="确认操作" :before-close="handleClose">
    <div>{{ message }}</div>
    <template v-slot:footer>
      <span class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isVisible: false,
    };
  },
  methods: {
    open() {
      this.isVisible = true;
    },
    close() {
      this.isVisible = false;
    },
    confirm() {
      this.close();
      this.$emit("confirm");
    },
    cancel() {
      this.close();
      this.$emit("cancel");
    },
    handleClose(done) {
      this.cancel();
      done();
    },
  },
};
</script>

<style scoped>
.el-dialog {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);

  font-family: "Roboto", sans-serif;
  color: #333;
}
.el-dialog__header {
  background-color: #e8f4fd;
  color: #333;
  font-weight: 500;
}

.el-dialog__body {
  padding: 20px;
  line-height: 1.5;
}

.dialog-footer {
  border-top: 1px solid #ebeef5;
  padding: 10px 20px;
}

.el-button {
  margin-right: 10px;
}

.el-button[type="primary"] {
  background-color: #409eff;
  border-color: #409eff;
}

.el-button[type="primary"]:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}
</style>
