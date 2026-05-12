-- ============================================
-- 达梦数据库初始化脚本
-- 数据库: 192.168.0.222:5236 / DAMENG
-- 用户: SYSDBA
-- 说明: 表会建在 SYSDBA 模式下，server.js 启动时会自动建表
-- 本文件供手动初始化参考
-- ============================================

-- ==================== mock_table ====================
CREATE TABLE mock_table (
  id VARCHAR2(64) NOT NULL PRIMARY KEY,
  title VARCHAR2(255) NOT NULL,
  status VARCHAR2(20) DEFAULT 'published' CHECK(status IN ('published', 'draft', 'deleted')),
  author VARCHAR2(100) NOT NULL,
  datetime TIMESTAMP NOT NULL,
  pageViews INT DEFAULT 0,
  img VARCHAR2(255),
  smallImg VARCHAR2(255),
  switch NUMBER(1) DEFAULT 1,
  "percent" INT DEFAULT 100
);

INSERT INTO mock_table (id, title, status, author, datetime, pageViews, img, smallImg, switch, "percent") VALUES
('1', '测试文章一', 'published', '张三', TIMESTAMP '2023-10-01 10:00:00', 1024, 'https://picsum.photos/200/200?random=1', 'https://picsum.photos/40/40?random=1', 1, 95);
INSERT INTO mock_table (id, title, status, author, datetime, pageViews, img, smallImg, switch, "percent") VALUES
('2', 'Vue3 实战指南', 'draft', '李四', TIMESTAMP '2023-10-02 14:30:00', 256, 'https://picsum.photos/200/200?random=2', 'https://picsum.photos/40/40?random=2', 0, 80);
INSERT INTO mock_table (id, title, status, author, datetime, pageViews, img, smallImg, switch, "percent") VALUES
('3', 'MySQL 入门', 'published', '王五', TIMESTAMP '2023-10-03 09:15:00', 4096, 'https://picsum.photos/200/200?random=3', 'https://picsum.photos/40/40?random=3', 1, 99);
INSERT INTO mock_table (id, title, status, author, datetime, pageViews, img, smallImg, switch, "percent") VALUES
('4', 'Docker 容器化部署', 'deleted', '赵六', TIMESTAMP '2023-10-04 16:45:00', 128, 'https://picsum.photos/200/200?random=4', 'https://picsum.photos/40/40?random=4', 0, 60);
INSERT INTO mock_table (id, title, status, author, datetime, pageViews, img, smallImg, switch, "percent") VALUES
('5', 'Node.js 后端开发', 'published', '钱七', TIMESTAMP '2023-10-05 11:20:00', 2048, 'https://picsum.photos/200/200?random=5', 'https://picsum.photos/40/40?random=5', 1, 90);

-- ==================== task_table ====================
CREATE TABLE task_table (
  id INT IDENTITY(1,1) PRIMARY KEY,
  title VARCHAR2(255) NOT NULL,
  description CLOB,
  assignee VARCHAR2(100),
  status VARCHAR2(50) DEFAULT 'pending',
  priority VARCHAR2(50) DEFAULT 'medium',
  createDate VARCHAR2(50),
  dueDate VARCHAR2(50),
  startDate VARCHAR2(50),
  completedDate VARCHAR2(50),
  completed NUMBER(1) DEFAULT 0
);

INSERT INTO task_table (title, description, assignee, status, priority, createDate, dueDate, startDate, completedDate, completed) VALUES
('设计新功能界面', '为新功能模块设计用户界面，包括主要页面布局和交互流程', '张三', 'pending', 'high', '2023-05-01', '2023-05-20', NULL, NULL, 0);
INSERT INTO task_table (title, description, assignee, status, priority, createDate, dueDate, startDate, completedDate, completed) VALUES
('开发用户认证模块', '实现用户注册、登录、权限验证等功能', '李四', 'in-progress', 'high', '2023-05-02', '2023-05-25', '2023-05-10', NULL, 0);
INSERT INTO task_table (title, description, assignee, status, priority, createDate, dueDate, startDate, completedDate, completed) VALUES
('编写API文档', '为已开发的API接口编写详细文档', '王五', 'completed', 'medium', '2023-04-28', '2023-05-10', NULL, '2023-05-09', 1);
INSERT INTO task_table (title, description, assignee, status, priority, createDate, dueDate, startDate, completedDate, completed) VALUES
('测试系统性能', '对系统进行压力测试，找出性能瓶颈', '赵六', 'pending', 'medium', '2023-05-05', '2023-05-30', NULL, NULL, 0);
INSERT INTO task_table (title, description, assignee, status, priority, createDate, dueDate, startDate, completedDate, completed) VALUES
('修复已知bug', '修复用户反馈的几个重要bug', '钱七', 'in-progress', 'high', '2023-05-03', '2023-05-18', '2023-05-12', NULL, 0);

-- ==================== meeting_application ====================
CREATE TABLE meeting_application (
  id INT IDENTITY(1,1) PRIMARY KEY,
  applicant VARCHAR2(100) NOT NULL,
  room VARCHAR2(255) NOT NULL,
  startTime TIMESTAMP NOT NULL,
  endTime TIMESTAMP NOT NULL,
  attendees INT NOT NULL,
  meetingName VARCHAR2(255) NOT NULL,
  branchLeaders VARCHAR2(255) DEFAULT '',
  status VARCHAR2(20) DEFAULT '确认' CHECK(status IN ('确认', '取消', '待审批')),
  submitTime TIMESTAMP NOT NULL
);

INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9419, '滕晓龙', '01号楼二楼会议室', TIMESTAMP '2024-05-15 08:00:00', TIMESTAMP '2024-05-15 17:00:00', 60, '全重实验室年会', '', '确认', TIMESTAMP '2024-04-02 08:44:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9458, '滕晓龙', '01号楼二楼会议室', TIMESTAMP '2024-05-13 13:00:00', TIMESTAMP '2024-05-13 17:00:00', 60, '"科学与中国——双千报告"', '', '确认', TIMESTAMP '2024-04-22 15:46:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9455, '朱泰来', '11号楼二楼会议室', TIMESTAMP '2024-04-30 13:00:00', TIMESTAMP '2024-04-30 17:00:00', 20, '青咖沙龙', '', '确认', TIMESTAMP '2024-04-21 16:50:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9465, '滕晓龙', '01号楼二楼会议室', TIMESTAMP '2024-04-30 13:00:00', TIMESTAMP '2024-04-30 17:00:00', 10, '基础局工作会议', '', '确认', TIMESTAMP '2024-04-27 12:06:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9466, '滕晓龙', '01号楼一楼会议室', TIMESTAMP '2024-04-30 13:00:00', TIMESTAMP '2024-04-30 17:00:00', 10, '基础局工作会议', '', '确认', TIMESTAMP '2024-04-27 12:08:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9468, '陈寅', '11号楼一楼会议室', TIMESTAMP '2024-04-29 13:00:00', TIMESTAMP '2024-04-29 17:00:00', 20, '览岳沙龙', '', '确认', TIMESTAMP '2024-04-27 15:22:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9472, '陈寅', '22号楼201会议室', TIMESTAMP '2024-04-29 09:00:00', TIMESTAMP '2024-04-29 12:00:00', 10, '科技合作处工作交流', '', '确认', TIMESTAMP '2024-04-28 11:22:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9469, '陈寅', '11号楼二楼会议室', TIMESTAMP '2024-04-29 08:00:00', TIMESTAMP '2024-04-29 17:00:00', 20, '先导专项汇报', '', '取消', TIMESTAMP '2024-04-27 15:32:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9470, '陈寅', '01号楼二楼会议室', TIMESTAMP '2024-04-29 08:00:00', TIMESTAMP '2024-04-29 17:00:00', 20, '先导B项目汇报', '', '确认', TIMESTAMP '2024-04-27 16:17:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9473, '薛芳', '22号楼201会议室', TIMESTAMP '2024-04-28 14:30:00', TIMESTAMP '2024-04-28 17:00:00', 5, '支部会', '', '确认', TIMESTAMP '2024-04-28 11:25:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9471, '陈寅', '22号楼504会议室', TIMESTAMP '2024-04-28 09:00:00', TIMESTAMP '2024-04-28 12:00:00', 7, '科技处工作会议', '', '确认', TIMESTAMP '2024-04-27 20:17:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9447, '杜奇', '22号楼504会议室', TIMESTAMP '2024-04-28 09:00:00', TIMESTAMP '2024-04-28 11:30:00', 25, '中国科学院上海分院-兰州分院资产管理工作交流会', '', '取消', TIMESTAMP '2024-04-17 14:03:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9454, '王晓霞', '01号楼二楼会议室', TIMESTAMP '2024-04-28 08:00:00', TIMESTAMP '2024-04-28 11:00:00', 50, '上海分院、兰州分院资产管理工作交流会', '', '确认', TIMESTAMP '2024-04-21 15:01:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9464, '薛芳', '22号楼201会议室', TIMESTAMP '2024-04-28 08:00:00', TIMESTAMP '2024-04-28 11:00:00', 6, '技能大赛筹备会', '', '确认', TIMESTAMP '2024-04-27 10:27:00');
INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
(9467, '居文君', '22号楼301会议室', TIMESTAMP '2024-04-27 14:00:00', TIMESTAMP '2024-04-27 17:00:00', 3, '五四大会讨论', '', '确认', TIMESTAMP '2024-04-27 13:21:00');

COMMIT;
