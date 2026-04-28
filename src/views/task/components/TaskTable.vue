<template>
  <el-table
    :data="data"
    style="width: 100%"
    row-key="id"
    v-loading="loading"
  >
    <el-table-column prop="title" label="任务标题" min-width="200">
      <template #default="{ row }">
        <div class="task-title">
          <el-checkbox
            v-if="type === 'all' || type === 'pending'"
            v-model="row.completed"
            @change="$emit('toggle-status', row)"
          ></el-checkbox>
          <span
            :class="{ 'completed-task': row.completed }"
            style="margin-left: 10px"
          >
            {{ row.title }}
          </span>
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="description" label="描述" min-width="200">
      <template #default="{ row }">
        <div class="task-description">{{ row.description }}</div>
      </template>
    </el-table-column>

    <el-table-column v-if="type === 'all'" label="状态" width="100">
      <template #default="{ row }">
        <el-tag :type="getStatusType(row.status)">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column prop="assignee" label="负责人" width="120" />

    <el-table-column v-if="type === 'in-progress'" prop="startDate" label="开始日期" width="120" />
    <el-table-column v-if="type !== 'completed'" prop="dueDate" label="截止日期" width="120" />
    <el-table-column v-if="type === 'completed'" prop="completedDate" label="完成日期" width="120" />

    <el-table-column v-if="type !== 'completed'" prop="priority" label="优先级" width="100">
      <template #default="{ row }">
        <el-tag :type="getPriorityType(row.priority)">
          {{ getPriorityText(row.priority) }}
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="操作" :width="type === 'all' ? 200 : 150">
      <template #default="{ row }">
        <template v-if="type === 'all'">
          <el-button type="text" @click="$emit('edit', row)">编辑</el-button>
          <el-button type="text" @click="$emit('view', row)">查看</el-button>
          <el-button type="text" @click="$emit('delete', row)">删除</el-button>
        </template>

        <template v-if="type === 'pending'">
          <el-button type="text" @click="$emit('edit', row)">编辑</el-button>
          <el-button type="text" @click="$emit('start', row)">开始</el-button>
        </template>

        <template v-if="type === 'in-progress'">
          <el-button type="text" @click="$emit('edit', row)">编辑</el-button>
          <el-button type="text" @click="$emit('complete', row)">完成</el-button>
        </template>

        <template v-if="type === 'completed'">
          <el-button type="text" @click="$emit('view', row)">查看</el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'TaskTable',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: 'all' // all, pending, in-progress, completed
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-status', 'edit', 'view', 'delete', 'start', 'complete'],
  methods: {
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
    }
  }
}
</script>

<style scoped>
.task-title {
  display: flex;
  align-items: center;
}
.completed-task {
  text-decoration: line-through;
  color: #909399;
}
.task-description {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
