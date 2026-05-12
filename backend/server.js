const express = require('express');
const dmdb = require('dmdb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dmdb.outFormat = dmdb.OUT_FORMAT_OBJECT;

let pool;

async function initPool() {
  pool = await dmdb.createPool({
    connectString: 'dm://SYSDBA:SYSDBA@192.168.0.222:5236?loginEncrypt=false',
    poolMax: 10,
    poolMin: 2,
  });
}

async function execute(sql, params = []) {
  const conn = await pool.getConnection();
  try {
    return await conn.execute(sql, params);
  } finally {
    await conn.close();
  }
}

function formatRows(rows, boolFields = []) {
  return rows.map(row => {
    const normalized = {};
    for (const key of Object.keys(row)) {
      const lk = key.toLowerCase();
      normalized[lk] = row[key];
    }
    for (const field of boolFields) {
      if (normalized[field] !== undefined) {
        normalized[field] = normalized[field] === 1;
      }
    }
    return normalized;
  });
}

// ================= 表格列表相关接口 =================

async function initMockTable() {
  try {
    await execute(`
      CREATE TABLE IF NOT EXISTS mock_table (
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
      )
    `);

    const countResult = await execute('SELECT COUNT(*) AS TOTAL FROM mock_table');
    if (countResult.rows[0].TOTAL === 0) {
      await execute(`INSERT INTO mock_table (id, title, status, author, datetime, pageViews, img, smallImg, switch, "percent") VALUES ('1', '测试文章一', 'published', '张三', TIMESTAMP '2023-10-01 10:00:00', 1024, 'https://picsum.photos/200/200?random=1', 'https://picsum.photos/40/40?random=1', 1, 95)`);
      await execute(`INSERT INTO mock_table (id, title, status, author, datetime, pageViews, img, smallImg, switch, "percent") VALUES ('2', 'Vue3 实战指南', 'draft', '李四', TIMESTAMP '2023-10-02 14:30:00', 256, 'https://picsum.photos/200/200?random=2', 'https://picsum.photos/40/40?random=2', 0, 80)`);
      await execute(`INSERT INTO mock_table (id, title, status, author, datetime, pageViews, img, smallImg, switch, "percent") VALUES ('3', 'MySQL 入门', 'published', '王五', TIMESTAMP '2023-10-03 09:15:00', 4096, 'https://picsum.photos/200/200?random=3', 'https://picsum.photos/40/40?random=3', 1, 99)`);
      await execute(`INSERT INTO mock_table (id, title, status, author, datetime, pageViews, img, smallImg, switch, "percent") VALUES ('4', 'Docker 容器化部署', 'deleted', '赵六', TIMESTAMP '2023-10-04 16:45:00', 128, 'https://picsum.photos/200/200?random=4', 'https://picsum.photos/40/40?random=4', 0, 60)`);
      await execute(`INSERT INTO mock_table (id, title, status, author, datetime, pageViews, img, smallImg, switch, "percent") VALUES ('5', 'Node.js 后端开发', 'published', '钱七', TIMESTAMP '2023-10-05 11:20:00', 2048, 'https://picsum.photos/200/200?random=5', 'https://picsum.photos/40/40?random=5', 1, 90)`);
      console.log('Mock table initialized with mock data.');
    }
  } catch (error) {
    console.error('Failed to init mock table:', error);
  }
}

app.post('/table/getList', async (req, res) => {
  try {
    const { title = '', pageNo = 1, pageSize = 20 } = req.body;
    const startRow = (Number(pageNo) - 1) * Number(pageSize);

    let whereClause = '';
    let countParams = [];
    if (title) {
      whereClause = ' WHERE title LIKE ?';
      countParams = [`%${title}%`];
    }

    const countResult = await execute(
      `SELECT COUNT(*) AS TOTAL FROM mock_table${whereClause}`,
      countParams
    );
    const totalCount = countResult.rows[0].TOTAL;

    const dataResult = await execute(
      `SELECT * FROM mock_table${whereClause} ORDER BY id OFFSET ? ROWS FETCH NEXT ? ROWS ONLY`,
      [...countParams, startRow, Number(pageSize)]
    );

    const formattedRows = formatRows(dataResult.rows, ['switch']);

    res.json({
      code: 200,
      msg: 'success',
      totalCount,
      data: formattedRows
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ code: 500, msg: 'Internal Server Error' });
  }
});

app.post('/table/doEdit', async (req, res) => {
  try {
    const { id, title, author } = req.body;
    if (id) {
      await execute('UPDATE mock_table SET title = ?, author = ? WHERE id = ?', [title, author, id]);
    }
    res.json({ code: 200, msg: '真实数据库：编辑保存成功' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ code: 500, msg: 'Internal Server Error' });
  }
});

app.post('/table/doDelete', async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      await execute('DELETE FROM mock_table WHERE id = ?', [id]);
    }
    res.json({ code: 200, msg: '真实数据库：删除成功' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ code: 500, msg: 'Internal Server Error' });
  }
});

// ================= 任务表初始化 =================
async function initTaskTable() {
  try {
    await execute(`
      CREATE TABLE IF NOT EXISTS task_table (
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
      )
    `);

    const countResult = await execute('SELECT COUNT(*) AS TOTAL FROM task_table');
    if (countResult.rows[0].TOTAL === 0) {
      await execute(`INSERT INTO task_table (title, description, assignee, status, priority, createDate, dueDate, startDate, completedDate, completed) VALUES ('设计新功能界面', '为新功能模块设计用户界面，包括主要页面布局和交互流程', '张三', 'pending', 'high', '2023-05-01', '2023-05-20', NULL, NULL, 0)`);
      await execute(`INSERT INTO task_table (title, description, assignee, status, priority, createDate, dueDate, startDate, completedDate, completed) VALUES ('开发用户认证模块', '实现用户注册、登录、权限验证等功能', '李四', 'in-progress', 'high', '2023-05-02', '2023-05-25', '2023-05-10', NULL, 0)`);
      await execute(`INSERT INTO task_table (title, description, assignee, status, priority, createDate, dueDate, startDate, completedDate, completed) VALUES ('编写API文档', '为已开发的API接口编写详细文档', '王五', 'completed', 'medium', '2023-04-28', '2023-05-10', NULL, '2023-05-09', 1)`);
      await execute(`INSERT INTO task_table (title, description, assignee, status, priority, createDate, dueDate, startDate, completedDate, completed) VALUES ('测试系统性能', '对系统进行压力测试，找出性能瓶颈', '赵六', 'pending', 'medium', '2023-05-05', '2023-05-30', NULL, NULL, 0)`);
      await execute(`INSERT INTO task_table (title, description, assignee, status, priority, createDate, dueDate, startDate, completedDate, completed) VALUES ('修复已知bug', '修复用户反馈的几个重要bug', '钱七', 'in-progress', 'high', '2023-05-03', '2023-05-18', '2023-05-12', NULL, 0)`);
      console.log('Task table initialized with mock data.');
    }
  } catch (error) {
    console.error('Failed to init task table:', error);
  }
}

// ================= 任务管理相关接口 =================

app.get('/task/getList', async (req, res) => {
  try {
    const result = await execute('SELECT * FROM task_table ORDER BY id DESC');
    const formattedRows = formatRows(result.rows, ['completed']);
    res.json({ code: 200, msg: 'success', data: formattedRows });
  } catch (error) {
    console.error('Task GetList Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

app.post('/task/doAdd', async (req, res) => {
  try {
    const { title, description, assignee, status, priority, createDate, dueDate } = req.body;
    await execute(
      'INSERT INTO task_table (title, description, assignee, status, priority, createDate, dueDate, completed) VALUES (?, ?, ?, ?, ?, ?, ?, 0)',
      [title, description, assignee, status, priority, createDate, dueDate]
    );
    res.json({ code: 200, msg: '真实数据库：添加任务成功' });
  } catch (error) {
    console.error('Task Add Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

app.post('/task/doEdit', async (req, res) => {
  try {
    const { id, title, description, assignee, status, priority, dueDate, startDate, completedDate, completed } = req.body;
    await execute(
      'UPDATE task_table SET title = ?, description = ?, assignee = ?, status = ?, priority = ?, dueDate = ?, startDate = ?, completedDate = ?, completed = ? WHERE id = ?',
      [title, description, assignee, status, priority, dueDate, startDate || null, completedDate || null, completed ? 1 : 0, id]
    );
    res.json({ code: 200, msg: '真实数据库：更新任务成功' });
  } catch (error) {
    console.error('Task Edit Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

app.post('/task/doDelete', async (req, res) => {
  try {
    const { id } = req.body;
    await execute('DELETE FROM task_table WHERE id = ?', [id]);
    res.json({ code: 200, msg: '真实数据库：删除任务成功' });
  } catch (error) {
    console.error('Task Delete Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

// ================= 会议室申请表初始化 =================
async function initMeetingTable() {
  try {
    await execute(`
      CREATE TABLE IF NOT EXISTS meeting_application (
        id INT PRIMARY KEY,
        applicant VARCHAR2(100) NOT NULL,
        room VARCHAR2(255) NOT NULL,
        startTime TIMESTAMP NOT NULL,
        endTime TIMESTAMP NOT NULL,
        attendees INT NOT NULL,
        meetingName VARCHAR2(255) NOT NULL,
        branchLeaders VARCHAR2(255) DEFAULT '',
        status VARCHAR2(20) DEFAULT '确认' CHECK(status IN ('确认', '取消', '待审批')),
        submitTime TIMESTAMP NOT NULL
      )
    `);

    const countResult = await execute('SELECT COUNT(*) AS TOTAL FROM meeting_application');
    if (countResult.rows[0].TOTAL === 0) {
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9419, '滕晓龙', '01号楼二楼会议室', TIMESTAMP '2024-05-15 08:00:00', TIMESTAMP '2024-05-15 17:00:00', 60, '全重实验室年会', '', '确认', TIMESTAMP '2024-04-02 08:44:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9458, '滕晓龙', '01号楼二楼会议室', TIMESTAMP '2024-05-13 13:00:00', TIMESTAMP '2024-05-13 17:00:00', 60, '科学与中国——双千报告', '', '确认', TIMESTAMP '2024-04-22 15:46:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9455, '朱泰来', '11号楼二楼会议室', TIMESTAMP '2024-04-30 13:00:00', TIMESTAMP '2024-04-30 17:00:00', 20, '青咖沙龙', '', '确认', TIMESTAMP '2024-04-21 16:50:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9465, '滕晓龙', '01号楼二楼会议室', TIMESTAMP '2024-04-30 13:00:00', TIMESTAMP '2024-04-30 17:00:00', 10, '基础局工作会议', '', '确认', TIMESTAMP '2024-04-27 12:06:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9466, '滕晓龙', '01号楼一楼会议室', TIMESTAMP '2024-04-30 13:00:00', TIMESTAMP '2024-04-30 17:00:00', 10, '基础局工作会议', '', '确认', TIMESTAMP '2024-04-27 12:08:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9468, '陈寅', '11号楼一楼会议室', TIMESTAMP '2024-04-29 13:00:00', TIMESTAMP '2024-04-29 17:00:00', 20, '览岳沙龙', '', '确认', TIMESTAMP '2024-04-27 15:22:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9472, '陈寅', '22号楼201会议室', TIMESTAMP '2024-04-29 09:00:00', TIMESTAMP '2024-04-29 12:00:00', 10, '科技合作处工作交流', '', '确认', TIMESTAMP '2024-04-28 11:22:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9469, '陈寅', '11号楼二楼会议室', TIMESTAMP '2024-04-29 08:00:00', TIMESTAMP '2024-04-29 17:00:00', 20, '先导专项汇报', '', '取消', TIMESTAMP '2024-04-27 15:32:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9470, '陈寅', '01号楼二楼会议室', TIMESTAMP '2024-04-29 08:00:00', TIMESTAMP '2024-04-29 17:00:00', 20, '先导B项目汇报', '', '确认', TIMESTAMP '2024-04-27 16:17:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9473, '薛芳', '22号楼201会议室', TIMESTAMP '2024-04-28 14:30:00', TIMESTAMP '2024-04-28 17:00:00', 5, '支部会', '', '确认', TIMESTAMP '2024-04-28 11:25:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9471, '陈寅', '22号楼504会议室', TIMESTAMP '2024-04-28 09:00:00', TIMESTAMP '2024-04-28 12:00:00', 7, '科技处工作会议', '', '确认', TIMESTAMP '2024-04-27 20:17:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9447, '杜奇', '22号楼504会议室', TIMESTAMP '2024-04-28 09:00:00', TIMESTAMP '2024-04-28 11:30:00', 25, '中国科学院上海分院-兰州分院资产管理工作交流会', '', '取消', TIMESTAMP '2024-04-17 14:03:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9454, '王晓霞', '01号楼二楼会议室', TIMESTAMP '2024-04-28 08:00:00', TIMESTAMP '2024-04-28 11:00:00', 50, '上海分院、兰州分院资产管理工作交流会', '', '确认', TIMESTAMP '2024-04-21 15:01:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9464, '薛芳', '22号楼201会议室', TIMESTAMP '2024-04-28 08:00:00', TIMESTAMP '2024-04-28 11:00:00', 6, '技能大赛筹备会', '', '确认', TIMESTAMP '2024-04-27 10:27:00')`);
      await execute(`INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (9467, '居文君', '22号楼301会议室', TIMESTAMP '2024-04-27 14:00:00', TIMESTAMP '2024-04-27 17:00:00', 3, '五四大会讨论', '', '确认', TIMESTAMP '2024-04-27 13:21:00')`);
      console.log('Meeting table initialized with real data.');
    }
  } catch (error) {
    console.error('Failed to init meeting table:', error);
  }
}

// ================= 会议室申请相关接口 =================

app.post('/meeting/getList', async (req, res) => {
  try {
    const { room, startDate, endDate, startTime, endTime, pageNo = 1, pageSize = 20 } = req.body;
    const startRow = (Number(pageNo) - 1) * Number(pageSize);
    let where = '';
    const conditions = [];
    const params = [];

    if (room) {
      conditions.push('room = ?');
      params.push(room);
    }
    if (startDate) {
      conditions.push('CAST(startTime AS DATE) >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('CAST(startTime AS DATE) <= ?');
      params.push(endDate);
    }
    if (startTime) {
      conditions.push("TO_CHAR(startTime, 'HH24:MI:SS') >= ?");
      params.push(startTime);
    }
    if (endTime) {
      conditions.push("TO_CHAR(startTime, 'HH24:MI:SS') <= ?");
      params.push(endTime);
    }

    if (conditions.length > 0) {
      where = ' WHERE ' + conditions.join(' AND ');
    }

    const countResult = await execute(
      `SELECT COUNT(*) AS TOTAL FROM meeting_application${where}`,
      params
    );
    const totalCount = countResult.rows[0].TOTAL;

    const dataResult = await execute(
      `SELECT * FROM meeting_application${where} ORDER BY id DESC OFFSET ? ROWS FETCH NEXT ? ROWS ONLY`,
      [...params, startRow, Number(pageSize)]
    );

    const formattedRows = formatRows(dataResult.rows);

    const mappedRows = formattedRows.map(row => ({
      id: row.id,
      applicant: row.applicant,
      room: row.room,
      startTime: row.starttime,
      endTime: row.endtime,
      attendees: row.attendees,
      meetingName: row.meetingname,
      branchLeaders: row.branchleaders,
      status: row.status,
      submitTime: row.submittime
    }));

    res.json({
      code: 200,
      msg: 'success',
      totalCount,
      data: mappedRows
    });
  } catch (error) {
    console.error('Meeting GetList Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

app.post('/meeting/doAdd', async (req, res) => {
  try {
    const { applicant, room, startTime, endTime, attendees, meetingName, branchLeaders } = req.body;
    await execute(
      'INSERT INTO meeting_application (applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [applicant, room, startTime, endTime, attendees, meetingName, branchLeaders || '', '待审批']
    );
    res.json({ code: 200, msg: '真实数据库：添加会议室申请成功' });
  } catch (error) {
    console.error('Meeting Add Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

app.post('/meeting/updateStatus', async (req, res) => {
  try {
    const { id, status } = req.body;
    await execute('UPDATE meeting_application SET status = ? WHERE id = ?', [status, id]);
    res.json({ code: 200, msg: '真实数据库：状态更新成功' });
  } catch (error) {
    console.error('Meeting UpdateStatus Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

app.post('/meeting/doDelete', async (req, res) => {
  try {
    const { id } = req.body;
    await execute('DELETE FROM meeting_application WHERE id = ?', [id]);
    res.json({ code: 200, msg: '真实数据库：删除成功' });
  } catch (error) {
    console.error('Meeting Delete Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

const PORT = 3000;

(async () => {
  try {
    await initPool();
    console.log('Dameng pool initialized.');
    await initMockTable();
    await initTaskTable();
    await initMeetingTable();
  } catch (e) {
    console.error('Init error:', e.message);
  }
  app.listen(PORT, () => {
    console.log(`Real Backend Server is running on http://localhost:${PORT}`);
    console.log('Database: Dameng @ 192.168.0.222:5236');
  });
})();
