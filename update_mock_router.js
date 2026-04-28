const fs = require('fs');

const mockPath = 'mock/controller/router.js';
let content = fs.readFileSync(mockPath, 'utf-8');

const newModulesStr = `
  {
    path: "/meeting",
    component: "Layout",
    redirect: "noRedirect",
    name: "Meeting",
    alwaysShow: true,
    meta: { title: "会议室管理", icon: "calendar-alt" },
    children: [
      { path: "register", name: "MeetingRegister", component: "@/views/meeting/register", meta: { title: "会议室登记" } },
      { path: "apply", name: "MeetingApply", component: "@/views/meeting/apply", meta: { title: "会议室申请" } },
      { path: "arrange", name: "MeetingArrange", component: "@/views/meeting/arrange", meta: { title: "会议室安排" } }
    ]
  },
  {
    path: "/vehicle",
    component: "Layout",
    redirect: "noRedirect",
    name: "Vehicle",
    alwaysShow: true,
    meta: { title: "工作用车管理", icon: "car" },
    children: [
      { path: "apply", name: "VehicleApply", component: "@/views/vehicle/apply", meta: { title: "工作用车申请" } },
      { path: "arrange", name: "VehicleArrange", component: "@/views/vehicle/arrange", meta: { title: "安排配车" } },
      { path: "reserve", name: "VehicleReserve", component: "@/views/vehicle/reserve", meta: { title: "预约情况" } }
    ]
  },
  {
    path: "/supplies",
    component: "Layout",
    redirect: "noRedirect",
    name: "Supplies",
    alwaysShow: true,
    meta: { title: "办公用品管理", icon: "box" },
    children: [
      { path: "receive", name: "SuppliesReceive", component: "@/views/supplies/receive", meta: { title: "办公用品领用" } },
      { path: "apply", name: "SuppliesApply", component: "@/views/supplies/apply", meta: { title: "申请物品" } },
      { path: "list", name: "SuppliesList", component: "@/views/supplies/list", meta: { title: "领用申请列表" } }
    ]
  },
  {
    path: "/travel",
    component: "Layout",
    redirect: "noRedirect",
    name: "Travel",
    alwaysShow: true,
    meta: { title: "差旅餐饮住宿管理", icon: "plane" },
    children: [
      { path: "apply", name: "TravelApply", component: "@/views/travel/apply", meta: { title: "差旅申请" } },
      { path: "list", name: "TravelList", component: "@/views/travel/list", meta: { title: "差旅申请列表" } },
      { path: "approve", name: "TravelApprove", component: "@/views/travel/approve", meta: { title: "领导审批" } }
    ]
  },
  {
    path: "/seal",
    component: "Layout",
    redirect: "noRedirect",
    name: "Seal",
    alwaysShow: true,
    meta: { title: "印章管理", icon: "stamp" },
    children: [
      { path: "apply", name: "SealApply", component: "@/views/seal/apply", meta: { title: "内部使用申请" } },
      { path: "list", name: "SealList", component: "@/views/seal/list", meta: { title: "申请列表" } },
      { path: "summary", name: "SealSummary", component: "@/views/seal/summary", meta: { title: "使用汇总" } }
    ]
  },
  {
    path: "/work",
    component: "Layout",
    redirect: "noRedirect",
    name: "Work",
    alwaysShow: true,
    meta: { title: "工作安排", icon: "clipboard-list" },
    children: [
      { path: "leader", name: "WorkLeader", component: "@/views/work/leader", meta: { title: "院领导工作安排" } },
      { path: "department", name: "WorkDepartment", component: "@/views/work/department", meta: { title: "部门重点工作安排" } },
      { path: "topic", name: "WorkTopic", component: "@/views/work/topic", meta: { title: "新增议题" } }
    ]
  },
  {
    path: "/info",
    component: "Layout",
    redirect: "noRedirect",
    name: "Info",
    alwaysShow: true,
    meta: { title: "信息发布", icon: "bullhorn" },
    children: [
      { path: "add", name: "InfoAdd", component: "@/views/info/add", meta: { title: "新增发布信息" } },
      { path: "list", name: "InfoList", component: "@/views/info/list", meta: { title: "信息列表" } },
      { path: "audit", name: "InfoAudit", component: "@/views/info/audit", meta: { title: "信息审核" } }
    ]
  },
  {
    path: "/property",
    component: "Layout",
    redirect: "noRedirect",
    name: "Property",
    alwaysShow: true,
    meta: { title: "物业管理", icon: "building" },
    children: [
      { path: "repair", name: "PropertyRepair", component: "@/views/property/repair", meta: { title: "维修申请" } },
      { path: "list", name: "PropertyList", component: "@/views/property/list", meta: { title: "维修申请列表" } },
      { path: "evaluate", name: "PropertyEvaluate", component: "@/views/property/evaluate", meta: { title: "评价" } }
    ]
  },
`;

// Dashboard block string
const dashboardRegex = /\{\s*path:\s*"\/dashboard",[\s\S]*?children:\s*\[[\s\S]*?\]\s*,\s*\},/;
let dashboardMatch = content.match(dashboardRegex);
if (dashboardMatch) {
  content = content.replace(dashboardMatch[0], '');
}

// Insert new modules right after index
const insertAfterStr = '        },\n      },\n    ],\n  },';
const insertIndex = content.indexOf(insertAfterStr) + insertAfterStr.length;
content = content.substring(0, insertIndex) + newModulesStr + content.substring(insertIndex);

// Move Vab to bottom (we need to be careful with extracting it)
let startVab = content.indexOf('  {\n    path: "/vab",');
if (startVab === -1) {
  startVab = content.indexOf('  {\r\n    path: "/vab",');
}

let count = 0;
let endVab = -1;
for (let i = startVab; i < content.length; i++) {
  if (content[i] === '{') count++;
  else if (content[i] === '}') count--;

  if (count === 0 && content[i] === '}') {
    endVab = i + 1;
    if (content[endVab] === ',') endVab++;
    break;
  }
}

const vabBlock = content.substring(startVab, endVab);
content = content.substring(0, startVab) + content.substring(endVab);

// Dashboard and Vab go before "module.exports" or at the end of the data array.
// The array ends right before `module.exports = [`
const arrayEndMatch = content.match(/];\s*module\.exports/);
if (arrayEndMatch) {
  const insertIdx = arrayEndMatch.index;
  content = content.substring(0, insertIdx) + (dashboardMatch ? dashboardMatch[0] : '') + '\n' + vabBlock + '\n' + content.substring(insertIdx);
} else {
  // Try to find the closing bracket of the data array.
  const dataEnd = content.lastIndexOf('];');
  if (dataEnd > -1) {
    content = content.substring(0, dataEnd) + (dashboardMatch ? dashboardMatch[0] : '') + '\n' + vabBlock + '\n' + content.substring(dataEnd);
  }
}

fs.writeFileSync(mockPath, content);
console.log('mock/controller/router.js updated successfully.');
