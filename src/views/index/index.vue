<template>
  <div class="new-index-container">
    <!-- 上方两列模块：左侧2/3通知公告，右侧1/3待审批 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card class="notification-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title"><el-icon><Bell /></el-icon> 通知公告</span>
              <el-button type="primary" link>更多</el-button>
            </div>
          </template>
          <div class="notification-list">
            <div v-for="(item, index) in notifications" :key="index" class="notification-item">
              <div class="item-left">
                <span class="dot"></span>
                <span class="title">{{ item.title }}</span>
                <span class="new-badge" v-if="item.isNew">NEW</span>
              </div>
              <span class="date">{{ item.date }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8" class="margin-top-xs">
        <el-card class="approval-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title"><el-icon><Finished /></el-icon> 待审批</span>
              <el-tag type="danger" effect="dark" round class="total-badge">11</el-tag>
            </div>
          </template>
          <div class="approval-list">
            <div class="approval-item">
              <div class="icon-wrapper" style="background-color: #ecf5ff; color: #409eff;">
                <el-icon><Notebook /></el-icon>
              </div>
              <div class="approval-content">
                <div class="approval-title">工作备忘录审批</div>
                <div class="approval-desc">您有 3 个工作备忘录申请待处理</div>
              </div>
              <el-button type="primary" link>去处理</el-button>
            </div>
            <div class="approval-item">
              <div class="icon-wrapper" style="background-color: #f0f9eb; color: #67c23a;">
                <el-icon><Notification /></el-icon>
              </div>
              <div class="approval-content">
                <div class="approval-title">信息发布审批</div>
                <div class="approval-desc">您有 5 个信息发布申请待处理</div>
              </div>
              <el-button type="primary" link>去处理</el-button>
            </div>
            <div class="approval-item">
              <div class="icon-wrapper" style="background-color: #fdf6ec; color: #e6a23c;">
                <el-icon><Van /></el-icon>
              </div>
              <div class="approval-content">
                <div class="approval-title">差旅审批</div>
                <div class="approval-desc">您有 2 个差旅申请待处理</div>
              </div>
              <el-button type="primary" link>去处理</el-button>
            </div>
            <div class="approval-item">
              <div class="icon-wrapper" style="background-color: #fef0f0; color: #f56c6c;">
                <el-icon><Connection /></el-icon>
              </div>
              <div class="approval-content">
                <div class="approval-title">工作用车审批</div>
                <div class="approval-desc">您有 1 个工作用车申请待处理</div>
              </div>
              <el-button type="primary" link>去处理</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下方：方框按钮快捷入口 -->
    <el-card class="shortcut-card" shadow="never">
      <div class="shortcut-container">
        <div
          v-for="(item, index) in shortcuts"
          :key="index"
          class="shortcut-btn"
          :style="{ '--bg-gradient': item.bg }"
          @click="navigateTo(item.route)"
        >
          <el-icon class="shortcut-icon"><component :is="item.icon" /></el-icon>
          <div class="shortcut-text">{{ item.name }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Bell, Finished, User, Document, Van, Message, Notebook, Notification,
  Calendar, Connection, Box, Coffee, SuccessFilled, HomeFilled
} from '@element-plus/icons-vue'

const router = useRouter()

const navigateTo = (route) => {
  router.push(route)
}

const notifications = ref([
  { title: '上海分院房产出租公示', date: '04-22', isNew: true },
  { title: '关于中国科学院上海分院基本账户及结算银行账号变更的通知', date: '04-20', isNew: true },
  { title: '2023年度上海分院系统“两优一先”评选结果公示', date: '04-20', isNew: true },
  { title: '中国科学院上海分院因公出访信息事前公示表', date: '04-17', isNew: true },
  { title: '关于上海分院机关工作人员兼职的公示', date: '04-16', isNew: true },
  { title: '关于关联交易的公示', date: '03-25', isNew: false },
  { title: '关于组织开展春季园区消防安全隐患大排查的通知', date: '03-25', isNew: false },
  { title: '上海分院房产调剂使用公示', date: '03-25', isNew: false },
  { title: '上海分院园区主干道及基础设施维修改造施工公告', date: '03-09', isNew: false },
])

const shortcuts = ref([
  { name: '会议室管理', icon: 'Calendar', bg: 'linear-gradient(135deg, #6BB5F8 0%, #358DE8 100%)', route: '/meeting/register' },
  { name: '工作用车管理', icon: 'Connection', bg: 'linear-gradient(135deg, #C2E55C 0%, #90C81A 100%)', route: '/vehicle/apply' },
  { name: '办公用品管理', icon: 'Box', bg: 'linear-gradient(135deg, #A89BFA 0%, #765EE5 100%)', route: '/supplies/apply' },
  { name: '差旅餐饮住宿', icon: 'Coffee', bg: 'linear-gradient(135deg, #FFA1A1 0%, #F55959 100%)', route: '/travel/apply' },
  { name: '印章管理', icon: 'SuccessFilled', bg: 'linear-gradient(135deg, #51E1C2 0%, #16B894 100%)', route: '/seal/apply' },
  { name: '工作安排', icon: 'Document', bg: 'linear-gradient(135deg, #F896CC 0%, #E64E9A 100%)', route: '/work/arrange' },
  { name: '信息发布', icon: 'Bell', bg: 'linear-gradient(135deg, #8FA4FF 0%, #4B6BFA 100%)', route: '/info/add' },
  { name: '物业管理', icon: 'HomeFilled', bg: 'linear-gradient(135deg, #FFC470 0%, #F88F22 100%)', route: '/property/repair' },
])
</script>

<style lang="scss" scoped>
.new-index-container {
  padding: 20px;
  background-color: #f5f7f8;
  min-height: calc(100vh - 84px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .card-title {
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #333;
  }
  .total-badge {
    font-weight: bold;
    padding: 0 10px;
  }
}

.notification-card {
  height: 420px;
  .notification-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    .notification-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px dashed #ebeef5;
      cursor: pointer;
      &:hover .title {
        color: #409eff;
      }
      .item-left {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        overflow: hidden;
        .dot {
          width: 6px;
          height: 6px;
          background-color: #409eff;
          border-radius: 50%;
        }
        .title {
          font-size: 14px;
          color: #606266;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.3s;
        }
        .new-badge {
          background-color: #f56c6c;
          color: white;
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 4px;
          transform: scale(0.8);
        }
      }
      .date {
        font-size: 13px;
        color: #999;
        margin-left: 15px;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
}

.approval-card {
  height: 420px;
  .approval-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    .approval-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 10px;
      border-radius: 8px;
      transition: background-color 0.3s;
      &:hover {
        background-color: #f5f7fa;
      }
      .icon-wrapper {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }
      .approval-content {
        flex: 1;
        .approval-title {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          margin-bottom: 4px;
        }
        .approval-desc {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .margin-top-xs {
    margin-top: 20px;
  }
}

.shortcut-card {
  margin-top: 20px;
  background-color: #f5f7fa;
  border: none;
  :deep(.el-card__body) {
    padding: 16px 20px;
  }
}

.shortcut-container {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16px;
  width: 100%;
}

.shortcut-btn {
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #333;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: var(--bg-gradient);
  position: relative;
  z-index: 1;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    opacity: 0.9;
    z-index: -1;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    color: white;

    &::before {
      opacity: 0;
    }

    .shortcut-icon, .shortcut-text {
      color: white;
    }
  }

  .shortcut-icon {
    font-size: 32px;
    margin-bottom: 8px;
    transition: color 0.3s ease;
    /* 取消之前可能存在的固定颜色，让它随父元素变化 */
  }

  .shortcut-text {
    font-size: 14px;
    font-weight: 500;
    padding: 0 8px;
    line-height: 1.3;
    transition: color 0.3s ease;
  }
}
@media (max-width: 1200px) {
  .shortcut-container {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 768px) {
  .shortcut-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
