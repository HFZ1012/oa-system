const fs = require('fs');

let content = fs.readFileSync('src/views/index/index.vue', 'utf-8');

// Update script section
content = content.replace(/<script setup>[\s\S]*?<\/script>/, `<script setup>
import { ref } from 'vue'
import {
  Bell, Finished, User, Document, Van, Message,
  Calendar, Connection, Box, Coffee, SuccessFilled, HomeFilled
} from '@element-plus/icons-vue'

const shortcuts = ref([
  { name: '会议室管理', icon: 'Calendar', color: '#53a3da', route: '/meeting/register' },
  { name: '工作用车管理', icon: 'Connection', color: '#bbd121', route: '/vehicle/apply' },
  { name: '办公用品管理', icon: 'Box', color: '#9793db', route: '/supplies/apply' },
  { name: '差旅餐饮住宿', icon: 'Coffee', color: '#ef7773', route: '/travel/apply' },
  { name: '印章管理', icon: 'SuccessFilled', color: '#37bfa3', route: '/seal/apply' },
  { name: '工作安排', icon: 'Document', color: '#dc65b5', route: '/work/arrange' },
  { name: '信息发布', icon: 'Bell', color: '#3f708a', route: '/info/add' },
  { name: '物业管理', icon: 'HomeFilled', color: '#e08c52', route: '/property/repair' },
])
</script>`);

// Update style section
content = content.replace(/\.shortcut-container[\s\S]*?<\/style>/, `.shortcut-container {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 16px;
  width: 100%;
}
.shortcut-btn {
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
    filter: brightness(1.08);
  }

  .shortcut-icon {
    font-size: 38px;
    margin-bottom: 12px;
  }

  .shortcut-text {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1px;
    text-align: center;
    padding: 0 8px;
    line-height: 1.3;
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
</style>`);

fs.writeFileSync('src/views/index/index.vue', content, 'utf-8');
console.log('Updated index.vue');
