const fs = require('fs');

const srcRouterPath = 'src/router/index.js';
let srcContent = fs.readFileSync(srcRouterPath, 'utf-8');

const newModulesStr = `
  {
    path: "/meeting",
    component: Layout,
    redirect: "noRedirect",
    name: "Meeting",
    alwaysShow: true,
    meta: { title: "会议室管理", icon: "calendar-alt" },
    children: [
      { path: "register", name: "MeetingRegister", component: () => import("@/views/meeting/register.vue"), meta: { title: "会议室登记" } },
      { path: "apply", name: "MeetingApply", component: () => import("@/views/meeting/apply.vue"), meta: { title: "会议室申请" } },
      { path: "arrange", name: "MeetingArrange", component: () => import("@/views/meeting/arrange.vue"), meta: { title: "会议室安排" } }
    ]
  },
  {
    path: "/vehicle",
    component: Layout,
    redirect: "noRedirect",
    name: "Vehicle",
    alwaysShow: true,
    meta: { title: "工作用车管理", icon: "car" },
    children: [
      { path: "apply", name: "VehicleApply", component: () => import("@/views/vehicle/apply.vue"), meta: { title: "工作用车申请" } },
      { path: "arrange", name: "VehicleArrange", component: () => import("@/views/vehicle/arrange.vue"), meta: { title: "安排配车" } },
      { path: "reserve", name: "VehicleReserve", component: () => import("@/views/vehicle/reserve.vue"), meta: { title: "预约情况" } }
    ]
  },
  {
    path: "/supplies",
    component: Layout,
    redirect: "noRedirect",
    name: "Supplies",
    alwaysShow: true,
    meta: { title: "办公用品管理", icon: "box" },
    children: [
      { path: "receive", name: "SuppliesReceive", component: () => import("@/views/supplies/receive.vue"), meta: { title: "办公用品领用" } },
      { path: "apply", name: "SuppliesApply", component: () => import("@/views/supplies/apply.vue"), meta: { title: "申请物品" } },
      { path: "list", name: "SuppliesList", component: () => import("@/views/supplies/list.vue"), meta: { title: "领用申请列表" } }
    ]
  },
  {
    path: "/travel",
    component: Layout,
    redirect: "noRedirect",
    name: "Travel",
    alwaysShow: true,
    meta: { title: "差旅餐饮住宿管理", icon: "plane" },
    children: [
      { path: "apply", name: "TravelApply", component: () => import("@/views/travel/apply.vue"), meta: { title: "差旅申请" } },
      { path: "list", name: "TravelList", component: () => import("@/views/travel/list.vue"), meta: { title: "差旅申请列表" } },
      { path: "approve", name: "TravelApprove", component: () => import("@/views/travel/approve.vue"), meta: { title: "领导审批" } }
    ]
  },
  {
    path: "/seal",
    component: Layout,
    redirect: "noRedirect",
    name: "Seal",
    alwaysShow: true,
    meta: { title: "印章管理", icon: "stamp" },
    children: [
      { path: "apply", name: "SealApply", component: () => import("@/views/seal/apply.vue"), meta: { title: "内部使用申请" } },
      { path: "list", name: "SealList", component: () => import("@/views/seal/list.vue"), meta: { title: "申请列表" } },
      { path: "summary", name: "SealSummary", component: () => import("@/views/seal/summary.vue"), meta: { title: "使用汇总" } }
    ]
  },
  {
    path: "/work",
    component: Layout,
    redirect: "noRedirect",
    name: "Work",
    alwaysShow: true,
    meta: { title: "工作安排", icon: "clipboard-list" },
    children: [
      { path: "leader", name: "WorkLeader", component: () => import("@/views/work/leader.vue"), meta: { title: "院领导工作安排" } },
      { path: "department", name: "WorkDepartment", component: () => import("@/views/work/department.vue"), meta: { title: "部门重点工作安排" } },
      { path: "topic", name: "WorkTopic", component: () => import("@/views/work/topic.vue"), meta: { title: "新增议题" } }
    ]
  },
  {
    path: "/info",
    component: Layout,
    redirect: "noRedirect",
    name: "Info",
    alwaysShow: true,
    meta: { title: "信息发布", icon: "bullhorn" },
    children: [
      { path: "add", name: "InfoAdd", component: () => import("@/views/info/add.vue"), meta: { title: "新增发布信息" } },
      { path: "list", name: "InfoList", component: () => import("@/views/info/list.vue"), meta: { title: "信息列表" } },
      { path: "audit", name: "InfoAudit", component: () => import("@/views/info/audit.vue"), meta: { title: "信息审核" } }
    ]
  },
  {
    path: "/property",
    component: Layout,
    redirect: "noRedirect",
    name: "Property",
    alwaysShow: true,
    meta: { title: "物业管理", icon: "building" },
    children: [
      { path: "repair", name: "PropertyRepair", component: () => import("@/views/property/repair.vue"), meta: { title: "维修申请" } },
      { path: "list", name: "PropertyList", component: () => import("@/views/property/list.vue"), meta: { title: "维修申请列表" } },
      { path: "evaluate", name: "PropertyEvaluate", component: () => import("@/views/property/evaluate.vue"), meta: { title: "评价" } }
    ]
  },
`;

// Insert after path: "/task" block
srcContent = srcContent.replace(/(path: "\/task"[\s\S]*?},\n\s+],)\n\s+},/, '$1\n  },' + newModulesStr);

// Extract and move Dashboard and Vab
// Note: Dashboard is right after index.
let dashboardRegex = /\s*{\s*path: "\/dashboard",[\s\S]*?redirect: "noRedirect",[\s\S]*?children: \[[\s\S]*?\]\s*,\s*},/;
let dashboardMatch = srcContent.match(dashboardRegex);
if (dashboardMatch) {
  srcContent = srcContent.replace(dashboardMatch[0], '');
}

let vabRegex = /\s*{\s*path: "\/vab",[\s\S]*?name: "Vab",[\s\S]*?children: \[(?:[^\[\]]*|\[[^\[\]]*\])*\]\s*,\s*},/;
// Since Vab has nested children, regex might be tricky. Let's use a simpler match or indexOf.
let vabStart = srcContent.indexOf('{', srcContent.indexOf('path: "/vab"')) - 4; // approximate start
let vabStr = '';
if (vabStart > -1) {
  // Simple brace counting
  let count = 0;
  let vabEnd = -1;
  for (let i = vabStart; i < srcContent.length; i++) {
    if (srcContent[i] === '{') count++;
    else if (srcContent[i] === '}') count--;

    if (count === 0 && srcContent[i] === '}') {
      // found end of vab object
      vabEnd = i + 1;
      // account for comma
      if (srcContent[vabEnd] === ',') vabEnd++;
      break;
    }
  }
  vabStr = srcContent.substring(vabStart, vabEnd);
  srcContent = srcContent.substring(0, vabStart) + srcContent.substring(vabEnd);
}

// Append dashboard and vab right before path: "/:pathMatch(.*)*"
let pathMatchIdx = srcContent.indexOf('path: "/:pathMatch(.*)*"');
let insertIdx = srcContent.lastIndexOf('{', pathMatchIdx) - 4; // start of the catch-all route

srcContent = srcContent.substring(0, insertIdx) + (dashboardMatch ? dashboardMatch[0] : '') + '\n' + vabStr + '\n' + srcContent.substring(insertIdx);

fs.writeFileSync(srcRouterPath, srcContent);

console.log('src/router/index.js updated successfully.');
