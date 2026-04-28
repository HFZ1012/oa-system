const data = [
  {
    path: "/",
    component: "Layout",
    redirect: "index",
    children: [
      {
        path: "index",
        name: "Index",
        component: "@/views/index/index",
        meta: {
          title: "首页",
          icon: "home",
          affix: true,
        },
      },
    ],
  },
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
    meta: { title: "工作用车管理", icon: "route" },
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
    meta: { title: "办公用品管理", icon: "box-open" },
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
    meta: { title: "差旅餐饮住宿管理", icon: "coffee" },
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
    meta: { title: "印章管理", icon: "check-circle" },
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
    meta: { title: "工作安排", icon: "form" },
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
    meta: { title: "信息发布", icon: "bell" },
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
    meta: { title: "物业管理", icon: "home" },
    children: [
      { path: "repair", name: "PropertyRepair", component: "@/views/property/repair", meta: { title: "维修申请" } },
      { path: "list", name: "PropertyList", component: "@/views/property/list", meta: { title: "维修申请列表" } },
      { path: "evaluate", name: "PropertyEvaluate", component: "@/views/property/evaluate", meta: { title: "评价" } }
    ]
  },



  {
    path: "/error",
    component: "EmptyLayout",
    redirect: "noRedirect",
    name: "Error",
    meta: { title: "错误页", icon: "bug" },
    children: [
      {
        path: "401",
        name: "Error401",
        component: "@/views/401",
        meta: { title: "401" },
      },
      {
        path: "404",
        name: "Error404",
        component: "@/views/404",
        meta: { title: "404" },
      },
    ],
  },
{
    path: "/dashboard",
    component: "Layout",
    redirect: "noRedirect",
    children: [
      {
        path: "index",
        name: "Dashboard",
        component: "@/views/index/dashboard",
        meta: {
          title: "原首页",
          icon: "box-open",
        },
      },
    ],
  },
  {
    path: "/vab",
    component: "Layout",
    redirect: "noRedirect",
    name: "Vab",
    alwaysShow: true,
    meta: { title: "组件", icon: "cloud" },
    children: [
      {
        path: "permissions",
        name: "Permission",
        component: "@/views/vab/permissions/index",
        meta: {
          title: "权限控制",
          permissions: ["admin", "editor"],
        },
      },
      {
        path: "icon",
        component: "EmptyLayout",
        redirect: "noRedirect",
        name: "Icon",
        meta: {
          title: "图标",
          permissions: ["admin"],
        },
        children: [
          {
            path: "awesomeIcon",
            name: "AwesomeIcon",
            component: "@/views/vab/icon/index",
            meta: { title: "常规图标" },
          },
          {
            path: "colorfulIcon",
            name: "ColorfulIcon",
            component: "@/views/vab/icon/colorfulIcon",
            meta: { title: "多彩图标" },
          },
        ],
      },
      {
        path: "table",
        component: "@/views/vab/table/index",
        name: "Table",
        meta: {
          title: "表格",
          permissions: ["admin"],
        },
      },
      {
        path: "webSocket",
        name: "WebSocket",
        component: "@/views/vab/webSocket/index",
        meta: { title: "webSocket", permissions: ["admin"] },
      },
      {
        path: "form",
        name: "Form",
        component: "@/views/vab/form/index",
        meta: { title: "表单", permissions: ["admin"] },
      },
      {
        path: "element",
        name: "Element",
        component: "@/views/vab/element/index",
        meta: { title: "常用组件", permissions: ["admin"] },
      },
      {
        path: "tree",
        name: "Tree",
        component: "@/views/vab/tree/index",
        meta: { title: "树", permissions: ["admin"] },
      },
      {
        path: "verify",
        name: "Verify",
        component: "@/views/vab/verify/index",
        meta: { title: "验证码", permissions: ["admin"] },
      },
      {
        path: "menu1",
        component: "@/views/vab/nested/menu1/index",
        name: "Menu1",
        alwaysShow: true,
        meta: {
          title: "嵌套路由 1",
          permissions: ["admin"],
        },
        children: [
          {
            path: "menu1-1",
            name: "Menu1-1",
            alwaysShow: true,
            meta: { title: "嵌套路由 1-1" },
            component: "@/views/vab/nested/menu1/menu1-1/index",

            children: [
              {
                path: "menu1-1-1",
                name: "Menu1-1-1",
                meta: { title: "嵌套路由 1-1-1" },
                component: "@/views/vab/nested/menu1/menu1-1/menu1-1-1/index",
              },
            ],
          },
        ],
      },
      {
        path: "loading",
        name: "Loading",
        component: "@/views/vab/loading/index",
        meta: { title: "loading", permissions: ["admin"] },
      },
      {
        path: "backToTop",
        name: "BackToTop",
        component: "@/views/vab/backToTop/index",
        meta: { title: "返回顶部", permissions: ["admin"] },
      },
      {
        path: "lodash",
        name: "Lodash",
        component: "@/views/vab/lodash/index",
        meta: { title: "lodash", permissions: ["admin"] },
      },
      {
        path: "log",
        name: "Log",
        component: "@/views/vab/errorLog/index",
        meta: { title: "错误日志模拟", permissions: ["admin"] },
      },
      {
        path: "more",
        name: "More",
        component: "@/views/vab/more/index",
        meta: { title: "关于", permissions: ["admin"] },
      },
    ],
  },
];
module.exports = [
  {
    url: "/menu/navigate",
    type: "post",
    response() {
      return { code: 200, msg: "success", data: data };
    },
  },
];
