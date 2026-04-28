/**
 * @author https://github.com/zxwk1998/vue-admin-better （不想保留author可删除）
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "@/layouts/index.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";
import { publicPath } from "@/config";

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    hidden: true,
  },
  {
    path: "/register",
    component: () => import("@/views/register/index.vue"),
    hidden: true,
  },
  {
    path: "/401",
    name: "401",
    component: () => import("@/views/401.vue"),
    hidden: true,
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/404.vue"),
    hidden: true,
  },
];

export const asyncRoutes = [
  {
    path: "/",
    component: Layout,
    redirect: "/index",
    children: [
      {
        path: "index",
        name: "Index",
        component: () => import("@/views/index/index.vue"),
        meta: {
          title: "首页",
          icon: "home",
          affix: true,
        },
      },
    ],
  },

  /* {
    path: "/test",
    component: Layout,
    redirect: "noRedirect",
    children: [
      {
        path: "test",
        name: "Test",
        component: () => import("@/views/test/index"),
        meta: {
          title: "test",
          icon: "marker",
          permissions: ["admin"],
        },
      },
    ],
  }, */


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
    meta: { title: "工作用车管理", icon: "route" },
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
    meta: { title: "办公用品管理", icon: "box-open" },
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
    meta: { title: "差旅餐饮住宿管理", icon: "coffee" },
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
    meta: { title: "印章管理", icon: "check-circle" },
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
    meta: { title: "工作安排", icon: "form" },
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
    meta: { title: "信息发布", icon: "bell" },
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
    meta: { title: "物业管理", icon: "home" },
    children: [
      { path: "repair", name: "PropertyRepair", component: () => import("@/views/property/repair.vue"), meta: { title: "维修申请" } },
      { path: "list", name: "PropertyList", component: () => import("@/views/property/list.vue"), meta: { title: "维修申请列表" } },
      { path: "evaluate", name: "PropertyEvaluate", component: () => import("@/views/property/evaluate.vue"), meta: { title: "评价" } }
    ]
  },
  {
    path: "/system",
    component: Layout,
    redirect: "noRedirect",
    name: "System",
    alwaysShow: true,
    meta: { title: "系统管理", icon: "cog" },
    children: [
      {
        path: "user",
        name: "UserManagement",
        component: () => import("@/views/vab/table.vue"),
        meta: { title: "用户管理" }
      },
      {
        path: "role",
        name: "RoleManagement",
        component: () => import("@/views/vab/table.vue"),
        meta: { title: "角色管理" }
      },
      {
        path: "menu",
        name: "MenuManagement",
        component: () => import("@/views/vab/table.vue"),
        meta: { title: "菜单管理" }
      }
    ]
  },


  /* {
    path: "/external-store",
    component: Layout,
    meta: {
      title: "",
      icon: "",
    },
    children: [
      {
        path: "https://vuejs-core.cn/store",
        meta: {
          title: "模板市场",
          target: "_blank",
          icon: "box-open",
        },
      },
    ],
  },
  {
    path: "/external-job",
    component: Layout,
    meta: {
      title: "",
      icon: "",
    },
    children: [
      {
        path: "https://job.vuejs-core.cn/posts",
        meta: {
          title: "找工作",
          target: "_blank",
          icon: "horse-head",
        },
      },
    ],
  },
  /* {
    path: "/error",
    component: EmptyLayout,
    redirect: "noRedirect",
    name: "Error",
    meta: { title: "错误页", icon: "bug" },
    children: [
      {
        path: "401",
        name: "Error401",
        component: () => import("@/views/401"),
        meta: { title: "401" },
      },
      {
        path: "404",
        name: "Error404",
        component: () => import("@/views/404"),
        meta: { title: "404" },
      },
    ],
  },
    {
    path: '/donate-menu',
    component: Layout,
    meta: {
      title: '支持我们',
      icon: 'heart',
    },
    children: [
      {
        path: '/donate',
        component: () => import('@/views/donate/index'),
        meta: {
          title: '支持我们',
          icon: 'heart',
          badge: 'Donate',
        },
      },
    ],
  },
  {
    path: "/task",
    component: Layout,
    redirect: "noRedirect",
    name: "Task",
    alwaysShow: true,
    meta: { title: "任务管理", icon: "list-ul" },
    children: [
      {
        path: "list",
        name: "TaskList",
        component: () => import("@/views/task/list.vue"),
        meta: {
          title: "任务管理列表",
          permissions: ["admin"],
        },
      },
    ],
  },
  {
    path: "/dashboard",
    component: Layout,
    redirect: "noRedirect",
    children: [
      {
        path: "index",
        name: "Dashboard",
        component: () => import("@/views/index/dashboard.vue"),
        meta: {
          title: "原首页",
          icon: "box-open",
        },
      },
    ],
  },
  {
    path: "/vab",
    component: Layout,
    redirect: "noRedirect",
    name: "Vab",
    alwaysShow: true,
    meta: { title: "组件", icon: "box-open", defaultOpen: true },
    children: [
      {
        path: "vue3Demo",
        name: "Vue3Demo",
        component: () => import("@/views/vab/vue3Demo/index.vue"),
        meta: {
          title: "Vue 3 示例",
          permissions: ["admin"],
        },
      },
      {
        path: "table",
        name: "Table",
        component: () => import("@/views/vab/table.vue"),
        meta: {
          title: "表格",
          permissions: ["admin"],
        },
      },
      {
        path: "tree",
        name: "Tree",
        component: () => import("@/views/vab/tree.vue"),
        meta: {
          title: "树形控件",
          permissions: ["admin"],
        },
      },
      {
        path: "icon",
        name: "Icon",
        component: () => import("@/views/vab/icon.vue"),
        meta: {
          title: "图标",
          permissions: ["admin"],
        },
      },
      {
        path: "form",
        name: "Form",
        component: () => import("@/views/vab/form.vue"),
        meta: {
          title: "表单",
          permissions: ["admin"],
        },
      },
      {
        path: "chart",
        name: "Chart",
        component: () => import("@/views/vab/chart.vue"),
        meta: {
          title: "图表",
          permissions: ["admin"],
        },
      },
      {
        path: "permissions",
        name: "Permissions",
        component: () => import("@/views/vab/permissions.vue"),
        meta: {
          title: "权限管理",
          permissions: ["admin"],
        },
      },
      {
        path: "nested",
        component: () => import("@/views/vab/nested.vue"),
        name: "Nested",
        redirect: "/vab/nested/menu1",
        meta: {
          title: "嵌套路由",
          permissions: ["admin"],
        },
        children: [
          {
            path: "menu1",
            component: () => import("@/views/vab/nested/menu1.vue"),
            name: "Menu1",
            redirect: "/vab/nested/menu1/menu2",
            meta: { title: "一级菜单" },
            children: [
              {
                path: "menu2",
                component: () => import("@/views/vab/nested/menu1/menu2.vue"),
                name: "Menu2",
                redirect: "/vab/nested/menu1/menu2/menu3",
                meta: { title: "二级菜单" },
                children: [
                  {
                    path: "menu3",
                    component: () => import("@/views/vab/nested/menu1/menu2/menu3.vue"),
                    name: "Menu3",
                    meta: { title: "三级菜单" },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "editor",
        name: "Editor",
        component: () => import("@/views/vab/editor.vue"),
        meta: {
          title: "富文本编辑器",
          permissions: ["admin"],
        },
      },
      {
        path: "upload",
        name: "Upload",
        component: () => import("@/views/vab/upload.vue"),
        meta: {
          title: "文件上传",
          permissions: ["admin"],
        },
      },
      {
        path: "settings",
        name: "Settings",
        component: () => import("@/views/vab/settings.vue"),
        meta: {
          title: "系统设置",
          permissions: ["admin"],
        },
      },
      {
        path: "notification",
        name: "Notification",
        component: () => import("@/views/vab/notification.vue"),
        meta: {
          title: "通知中心",
          permissions: ["admin"],
        },
      },
      {
        path: "calendar",
        name: "Calendar",
        component: () => import("@/views/vab/calendar.vue"),
        meta: {
          title: "日历",
          permissions: ["admin"],
        },
      },

      {
        path: "statistics",
        name: "Statistics",
        component: () => import("@/views/vab/statistics.vue"),
        meta: {
          title: "数据统计",
          permissions: ["admin"],
        },
      },
      {
        path: "help",
        name: "Help",
        component: () => import("@/views/vab/help.vue"),
        meta: {
          title: "帮助中心",
          permissions: ["admin"],
        },
      },
      {
        path: "project",
        name: "Project",
        component: () => import("@/views/vab/project.vue"),
        meta: {
          title: "项目管理",
          permissions: ["admin"],
        },
      },
      {
        path: "team",
        name: "Team",
        component: () => import("@/views/vab/team.vue"),
        meta: {
          title: "团队管理",
          permissions: ["admin"],
        },
      },
      {
        path: "workflow",
        name: "Workflow",
        component: () => import("@/views/vab/workflow.vue"),
        meta: {
          title: "工作流",
          permissions: ["admin"],
        },
      },
      {
        path: "knowledge",
        name: "Knowledge",
        component: () => import("@/views/vab/knowledge.vue"),
        meta: {
          title: "知识库",
          permissions: ["admin"],
        },
      },
      {
        path: "customer",
        name: "Customer",
        component: () => import("@/views/vab/customer.vue"),
        meta: {
          title: "客户管理",
          permissions: ["admin"],
        },
      },
      {
        path: "product",
        name: "Product",
        component: () => import("@/views/vab/product.vue"),
        meta: {
          title: "产品管理",
          permissions: ["admin"],
        },
      },
      {
        path: "order",
        name: "Order",
        component: () => import("@/views/vab/order.vue"),
        meta: {
          title: "订单管理",
          permissions: ["admin"],
        },
      },
      // {
      //   path: "campaign",
      //   name: "Campaign",
      //   component: () => import("@/views/vab/campaign.vue"),
      //   meta: {
      //     title: "营销活动",
      //     permissions: ["admin"],
      //   },
      // },
    ],
  }, */
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    hidden: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(publicPath),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export function resetRouter() {
  // 注意：所有动态路由路由必须带有name属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name } = route;
      if (name && name !== "Login") {
        router.hasRoute(name) && router.removeRoute(name);
      }
    });
  } catch (error) {
    // 强制刷新浏览器，不要用这种方式
    window.location.reload();
  }
}

export default router;
