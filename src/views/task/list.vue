<template>
  <div class="task-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>任务管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchText"
              placeholder="搜索任务..."
              clearable
              style="width: 200px; margin-right: 10px"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select
              v-model="filterStatus"
              placeholder="状态筛选"
              style="width: 120px; margin-right: 10px"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="待办" value="pending"></el-option>
              <el-option label="进行中" value="in-progress"></el-option>
              <el-option label="已完成" value="completed"></el-option>
            </el-select>
            <el-button type="primary" @click="showAddTaskDialog">添加任务</el-button>
          </div>
        </div>
      </template>

      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="全部任务" name="all">
          <task-table
            :data="filteredTasks"
            type="all"
            :loading="loading"
            @toggle-status="toggleTaskStatus"
            @edit="editTask"
            @view="viewTask"
            @delete="deleteTask"
          />
        </el-tab-pane>

        <el-tab-pane label="待办任务" name="pending">
          <task-table
            :data="pendingTasks"
            type="pending"
            @toggle-status="toggleTaskStatus"
            @edit="editTask"
            @start="startTask"
          />
        </el-tab-pane>

        <el-tab-pane label="进行中任务" name="in-progress">
          <task-table
            :data="inProgressTasks"
            type="in-progress"
            @edit="editTask"
            @complete="completeTask"
          />
        </el-tab-pane>

        <el-tab-pane label="已完成任务" name="completed">
          <task-table
            :data="completedTasks"
            type="completed"
            @view="viewTask"
          />
        </el-tab-pane>
      </el-tabs>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="totalTasks"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑任务对话框组件 -->
    <task-dialog
      v-model="taskDialogVisible"
      :editing-task="editingTask"
      :users="users"
      @save="saveTask"
    />

    <!-- 任务详情对话框 (可以继续抽离，这里为简单起见先留在这里) -->
    <el-dialog
      v-model="detailDialogVisible"
      title="任务详情"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="任务标题">{{ detailTask.title }}</el-descriptions-item>
        <el-descriptions-item label="任务描述">{{ detailTask.description }}</el-descriptions-item>
        <el-descriptions-item label="负责人">{{ detailTask.assignee }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(detailTask.status)">
            {{ getStatusText(detailTask.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="优先级">
          <el-tag :type="getPriorityType(detailTask.priority)">
            {{ getPriorityText(detailTask.priority) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="创建日期">{{ detailTask.createDate }}</el-descriptions-item>
        <el-descriptions-item label="截止日期">{{ detailTask.dueDate }}</el-descriptions-item>
        <el-descriptions-item v-if="detailTask.startDate" label="开始日期">{{ detailTask.startDate }}</el-descriptions-item>
        <el-descriptions-item v-if="detailTask.completedDate" label="完成日期">{{ detailTask.completedDate }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Search } from "@element-plus/icons-vue";
import { getList, doAdd, doEdit, doDelete } from '@/api/task';
import TaskTable from './components/TaskTable.vue';
import TaskDialog from './components/TaskDialog.vue';

export default {
  name: "TaskList",
  components: {
    Search,
    TaskTable,
    TaskDialog
  },
  data() {
    return {
      activeTab: "all",
      searchText: "",
      filterStatus: "",
      currentPage: 1,
      pageSize: 10,
      totalTasks: 0,
      loading: false,
      taskDialogVisible: false,
      detailDialogVisible: false,
      editingTask: null,
      tasks: [],
      users: [
        { id: 1, name: "张三" },
        { id: 2, name: "李四" },
        { id: 3, name: "王五" },
        { id: 4, name: "赵六" },
        { id: 5, name: "钱七" }
      ],
      detailTask: {}
    };
  },
  computed: {
    filteredTasks() {
      let result = this.tasks;

      if (this.searchText) {
        result = result.filter(task =>
          task.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
          task.description.toLowerCase().includes(this.searchText.toLowerCase())
        );
      }

      if (this.filterStatus) {
        result = result.filter(task => task.status === this.filterStatus);
      }

      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return result.slice(start, end);
    },
    pendingTasks() {
      return this.tasks.filter(task => task.status === "pending");
    },
    inProgressTasks() {
      return this.tasks.filter(task => task.status === "in-progress");
    },
    completedTasks() {
      return this.tasks.filter(task => task.status === "completed");
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const { data } = await getList();
        this.tasks = data || [];
        this.totalTasks = this.tasks.length;
      } catch (error) {
        this.$message.error('获取任务列表失败');
      } finally {
        this.loading = false;
      }
    },
    handleTabChange(tab) {
      this.activeTab = tab;
      this.currentPage = 1;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    getStatusText(status) {
      const statusMap = {
        "pending": "待办",
        "in-progress": "进行中",
        "completed": "已完成"
      };
      return statusMap[status] || status;
    },
    getStatusType(status) {
      const typeMap = {
        "pending": "info",
        "in-progress": "warning",
        "completed": "success"
      };
      return typeMap[status] || "info";
    },
    getPriorityText(priority) {
      const priorityMap = {
        "low": "低",
        "medium": "中",
        "high": "高"
      };
      return priorityMap[priority] || priority;
    },
    getPriorityType(priority) {
      const typeMap = {
        "low": "info",
        "medium": "",
        "high": "danger"
      };
      return typeMap[priority] || "info";
    },
    showAddTaskDialog() {
      this.editingTask = null;
      this.taskDialogVisible = true;
    },
    editTask(task) {
      this.editingTask = task;
      this.taskDialogVisible = true;
    },
    viewTask(task) {
      this.detailTask = { ...task };
      this.detailDialogVisible = true;
    },
    deleteTask(task) {
      this.$confirm(`确定要删除任务"${task.title}"吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        try {
          await doDelete({ id: task.id });
          this.$message.success("真实数据库：任务删除成功");
          this.fetchData();
        } catch (error) {
          this.$message.error('删除失败');
        }
      }).catch(() => {
        this.$message.info("已取消删除");
      });
    },
    async saveTask(taskData) {
      try {
        if (this.editingTask) {
          // 编辑任务
          await doEdit({ ...this.editingTask, ...taskData });
          this.$message.success("真实数据库：任务更新成功");
        } else {
          // 添加任务
          const newTask = {
            createDate: this.formatDate(new Date()),
            ...taskData
          };
          await doAdd(newTask);
          this.$message.success("真实数据库：任务添加成功");
        }
        this.taskDialogVisible = false;
        this.fetchData();
      } catch (error) {
        this.$message.error('保存失败');
      }
    },
    async toggleTaskStatus(task) {
      try {
        const updateData = { ...task };
        if (task.completed) {
          updateData.status = "completed";
          updateData.completedDate = this.formatDate(new Date());
        } else {
          updateData.status = "pending";
          updateData.completedDate = null;
        }
        await doEdit(updateData);
        this.$message.success("真实数据库：任务状态已更新");
        this.fetchData();
      } catch (error) {
        this.$message.error('更新失败');
      }
    },
    async startTask(task) {
      try {
        const updateData = {
          ...task,
          status: "in-progress",
          startDate: this.formatDate(new Date())
        };
        await doEdit(updateData);
        this.$message.success("真实数据库：任务已开始");
        this.fetchData();
      } catch (error) {
        this.$message.error('更新失败');
      }
    },
    async completeTask(task) {
      try {
        const updateData = {
          ...task,
          status: "completed",
          completedDate: this.formatDate(new Date()),
          completed: true
        };
        await doEdit(updateData);
        this.$message.success("真实数据库：任务已完成");
        this.fetchData();
      } catch (error) {
        this.$message.error('更新失败');
      }
    },
    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.task-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
