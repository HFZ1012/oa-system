<template>
  <el-dialog
    v-model="dialogVisible"
    :title="editingTask ? '编辑任务' : '添加任务'"
    width="600px"
    @close="handleClose"
  >
    <el-form
      ref="taskFormRef"
      :model="taskForm"
      :rules="taskRules"
      label-width="100px"
    >
      <el-form-item label="任务标题" prop="title">
        <el-input v-model="taskForm.title" />
      </el-form-item>

      <el-form-item label="任务描述" prop="description">
        <el-input
          v-model="taskForm.description"
          type="textarea"
          :rows="3"
        />
      </el-form-item>

      <el-form-item label="负责人" prop="assignee">
        <el-select v-model="taskForm.assignee" placeholder="请选择负责人" style="width: 100%">
          <el-option
            v-for="user in users"
            :key="user.id"
            :label="user.name"
            :value="user.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="截止日期" prop="dueDate">
        <el-date-picker
          v-model="taskForm.dueDate"
          type="date"
          placeholder="选择截止日期"
          format="YYYY年MM月DD日"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item label="优先级" prop="priority">
        <el-select v-model="taskForm.priority" placeholder="请选择优先级" style="width: 100%">
          <el-option label="低" value="low"></el-option>
          <el-option label="中" value="medium"></el-option>
          <el-option label="高" value="high"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="taskForm.status" placeholder="请选择状态" style="width: 100%">
          <el-option label="待办" value="pending"></el-option>
          <el-option label="进行中" value="in-progress"></el-option>
          <el-option label="已完成" value="completed"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="saveTask"
        >
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'TaskDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    editingTask: {
      type: Object,
      default: null
    },
    users: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'save'],
  data() {
    return {
      taskForm: {
        title: "",
        description: "",
        assignee: "",
        dueDate: "",
        priority: "medium",
        status: "pending"
      },
      taskRules: {
        title: [
          { required: true, message: "请输入任务标题", trigger: "blur" }
        ],
        assignee: [
          { required: true, message: "请选择负责人", trigger: "change" }
        ],
        dueDate: [
          { required: true, message: "请选择截止日期", trigger: "change" }
        ]
      }
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit('update:modelValue', val);
      }
    }
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        if (this.editingTask) {
          this.taskForm = { ...this.editingTask };
        } else {
          this.taskForm = {
            title: "",
            description: "",
            assignee: "",
            dueDate: "",
            priority: "medium",
            status: "pending"
          };
        }
        this.$nextTick(() => {
          if (this.$refs.taskFormRef) {
            this.$refs.taskFormRef.clearValidate();
          }
        });
      }
    }
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    saveTask() {
      this.$refs.taskFormRef.validate((valid) => {
        if (valid) {
          this.$emit('save', this.taskForm);
        }
      });
    }
  }
}
</script>
