<template>
  <div class="meeting-apply-container">
    <el-card shadow="never" class="query-card">
      <el-form :inline="true" :model="queryForm" class="query-form">
        <el-form-item label="会议室">
          <el-select v-model="queryForm.room" placeholder="选择会议室" clearable style="width: 180px">
            <el-option label="01号楼一楼会议室" value="01号楼一楼会议室" />
            <el-option label="01号楼二楼会议室" value="01号楼二楼会议室" />
            <el-option label="11号楼一楼会议室" value="11号楼一楼会议室" />
            <el-option label="11号楼二楼会议室" value="11号楼二楼会议室" />
            <el-option label="22号楼201会议室" value="22号楼201会议室" />
            <el-option label="22号楼301会议室" value="22号楼301会议室" />
            <el-option label="22号楼504会议室" value="22号楼504会议室" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="queryForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            clearable
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-time-picker
            v-model="queryForm.timeRange"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="HH:mm"
            value-format="HH:mm"
            clearable
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="table-toolbar">
        <el-button type="primary" icon="Plus" @click="handleAdd">新增申请</el-button>
        <el-button type="success" icon="Download" @click="handleExport">导出数据</el-button>
      </div>

      <el-table v-loading="listLoading" :data="tableData" style="width: 100%" border>
        <el-table-column prop="id" label="序号" width="80" align="center" />
        <el-table-column prop="applicant" label="申请人" width="100" />
        <el-table-column prop="room" label="会议室" width="150" />
        <el-table-column prop="startTime" label="开始时间" width="140">
          <template #default="{ row }">
            {{ formatTime(row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="140">
          <template #default="{ row }">
            {{ formatTime(row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="attendees" label="出席人数" width="90" align="center" />
        <el-table-column prop="meetingName" label="会议名称" show-overflow-tooltip min-width="150" />
        <el-table-column prop="branchLeaders" label="分院领导" width="100" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <span :class="['status-text', row.status === '确认' ? 'status-success' : (row.status === '取消' ? 'status-danger' : 'status-warning')]">
              {{ row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="140">
          <template #default="{ row }">
            {{ formatTime(row.submitTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              v-if="row.status === '待审批'"
              type="primary"
              link
              @click="handleApprove(row, '确认')"
            >确认</el-button>
            <el-button
              v-if="row.status === '待审批'"
              type="danger"
              link
              @click="handleApprove(row, '取消')"
            >取消</el-button>
            <el-button type="info" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:currentPage="page.currentPage"
          v-model:pageSize="page.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 新增申请弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增会议室申请" width="550px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="申请人" prop="applicant">
          <el-input v-model="form.applicant" placeholder="请输入申请人姓名" />
        </el-form-item>
        <el-form-item label="会议室" prop="room">
          <el-select v-model="form.room" placeholder="请选择会议室" style="width: 100%">
            <el-option label="01号楼一楼会议室" value="01号楼一楼会议室" />
            <el-option label="01号楼二楼会议室" value="01号楼二楼会议室" />
            <el-option label="11号楼一楼会议室" value="11号楼一楼会议室" />
            <el-option label="11号楼二楼会议室" value="11号楼二楼会议室" />
            <el-option label="22号楼201会议室" value="22号楼201会议室" />
            <el-option label="22号楼301会议室" value="22号楼301会议室" />
            <el-option label="22号楼504会议室" value="22号楼504会议室" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="出席人数" prop="attendees">
          <el-input-number v-model="form.attendees" :min="1" :max="500" style="width: 100%" />
        </el-form-item>
        <el-form-item label="会议名称" prop="meetingName">
          <el-input v-model="form.meetingName" placeholder="请输入会议名称" />
        </el-form-item>
        <el-form-item label="分院领导" prop="branchLeaders">
          <el-input v-model="form.branchLeaders" placeholder="请输入分院领导 (选填)" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">提交申请</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMeetingList, doMeetingAdd, updateMeetingStatus, doMeetingDelete } from '@/api/meeting'

const tableData = ref([])
const listLoading = ref(false)
const total = ref(0)

// 查询表单
const queryForm = reactive({
  room: '',
  dateRange: null,
  timeRange: null
})

// 分页
const page = reactive({
  currentPage: 1,
  pageSize: 20
})

// 格式化时间显示 (例如 2024-05-15T08:00:00.000Z -> 05-15 08:00)
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

// 获取数据
const fetchData = async () => {
  listLoading.value = true
  try {
    const res = await getMeetingList({
      room: queryForm.room,
      startDate: queryForm.dateRange ? queryForm.dateRange[0] : '',
      endDate: queryForm.dateRange ? queryForm.dateRange[1] : '',
      startTime: queryForm.timeRange ? queryForm.timeRange[0] : '',
      endTime: queryForm.timeRange ? queryForm.timeRange[1] : '',
      pageNo: page.currentPage,
      pageSize: page.pageSize
    })
    if (res.code === 200) {
      tableData.value = res.data
      total.value = res.totalCount
    } else {
      ElMessage.error(res.msg || '获取数据失败')
    }
  } catch (error) {
    console.error(error)
    ElMessage.error('网络请求失败')
  } finally {
    listLoading.value = false
  }
}

// 初始化获取数据
onMounted(() => {
  fetchData()
})

const handleQuery = () => {
  page.currentPage = 1
  fetchData()
}

const resetQuery = () => {
  queryForm.room = ''
  queryForm.dateRange = null
  queryForm.timeRange = null
  page.currentPage = 1
  fetchData()
}

const handleSizeChange = (val) => {
  page.pageSize = val
  fetchData()
}

const handleCurrentChange = (val) => {
  page.currentPage = val
  fetchData()
}

// 审批操作
const handleApprove = (row, result) => {
  ElMessageBox.confirm(`确定要将该申请状态修改为“${result}”吗？`, '操作提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: result === '确认' ? 'success' : 'warning'
  }).then(async () => {
    try {
      const res = await updateMeetingStatus({ id: row.id, status: result })
      if (res.code === 200) {
        ElMessage.success(`操作成功：已${result}`)
        fetchData()
      } else {
        ElMessage.error(res.msg || '操作失败')
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('网络请求失败')
    }
  }).catch(() => {})
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该条申请记录吗？', '删除提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'danger'
  }).then(async () => {
    try {
      const res = await doMeetingDelete({ id: row.id })
      if (res.code === 200) {
        ElMessage.success('删除成功')
        fetchData()
      } else {
        ElMessage.error(res.msg || '删除失败')
      }
    } catch (error) {
      console.error(error)
      ElMessage.error('网络请求失败')
    }
  }).catch(() => {})
}

// 新增相关
const dialogVisible = ref(false)
const formRef = ref(null)
const form = reactive({
  applicant: '',
  room: '',
  startTime: '',
  endTime: '',
  attendees: 10,
  meetingName: '',
  branchLeaders: ''
})

const rules = {
  applicant: [{ required: true, message: '请输入申请人', trigger: 'blur' }],
  room: [{ required: true, message: '请选择会议室', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  attendees: [{ required: true, message: '请输入出席人数', trigger: 'blur' }],
  meetingName: [{ required: true, message: '请输入会议名称', trigger: 'blur' }]
}

const handleAdd = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  form.applicant = ''
  form.room = ''
  form.startTime = ''
  form.endTime = ''
  form.attendees = 10
  form.meetingName = ''
  form.branchLeaders = ''
  dialogVisible.value = true
}

const submitForm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const res = await doMeetingAdd(form)
        if (res.code === 200) {
          ElMessage.success('申请提交成功')
          dialogVisible.value = false
          fetchData()
        } else {
          ElMessage.error(res.msg || '提交失败')
        }
      } catch (error) {
        console.error(error)
        ElMessage.error('网络请求失败')
      }
    }
  })
}

// 导出相关
const handleExport = () => {
  if (tableData.value.length === 0) {
    ElMessage.warning('没有可导出的数据')
    return
  }

  // 生成CSV内容
  const headers = ['序号', '申请人', '会议室', '开始时间', '结束时间', '出席人数', '会议名称', '分院领导', '状态', '提交时间']
  const rows = tableData.value.map((item) => [
    item.id,
    item.applicant,
    item.room,
    formatTime(item.startTime),
    formatTime(item.endTime),
    item.attendees,
    item.meetingName,
    item.branchLeaders || '',
    item.status,
    formatTime(item.submitTime)
  ])

  let csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
  csvContent += headers.join(',') + '\n'
  rows.forEach(row => {
    // 处理可能包含逗号的文本字段
    const safeRow = row.map(cell => {
      if (typeof cell === 'string' && cell.includes(',')) {
        return `"${cell}"`
      }
      return cell
    })
    csvContent += safeRow.join(',') + '\n'
  })

  // 下载
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `会议室申请记录_${new Date().getTime()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  ElMessage.success('数据已导出')
}

</script>

<style lang="scss" scoped>
.meeting-apply-container {
  padding: 20px;

  .query-card {
    margin-bottom: 20px;
  }

  .query-form {
    margin-bottom: 10px;
  }

  .table-toolbar {
    margin-bottom: 15px;
    display: flex;
    justify-content: flex-start;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .status-text {
    font-weight: bold;
  }
  .status-success {
    color: #67C23A;
  }
  .status-danger {
    color: #F56C6C;
  }
  .status-warning {
    color: #E6A23C;
  }
}
</style>
