const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'vue3_admin',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 获取表格列表
app.post('/table/getList', async (req, res) => {
  try {
    const { title = '', pageNo = 1, pageSize = 20 } = req.body;

    let query = 'SELECT * FROM mock_table';
    let countQuery = 'SELECT COUNT(*) as total FROM mock_table';
    const params = [];

    if (title) {
      query += ' WHERE title LIKE ?';
      countQuery += ' WHERE title LIKE ?';
      params.push(`%${title}%`);
    }

    // 获取总数
    const [countRows] = await pool.query(countQuery, params);
    const totalCount = countRows[0].total;

    // 分页
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(pageSize), (Number(pageNo) - 1) * Number(pageSize));

    const [rows] = await pool.query(query, params);

    // 转换 tinyint(1) 为 boolean 以兼容前端 mock 的格式
    const formattedRows = rows.map(row => ({
      ...row,
      switch: row.switch === 1
    }));

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

// 模拟编辑
app.post('/table/doEdit', async (req, res) => {
  try {
    const { id, title, author } = req.body;
    if (id) {
      await pool.query('UPDATE mock_table SET title = ?, author = ? WHERE id = ?', [title, author, id]);
    }
    res.json({
      code: 200,
      msg: '真实数据库：编辑保存成功'
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ code: 500, msg: 'Internal Server Error' });
  }
});

// 模拟删除
app.post('/table/doDelete', async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      await pool.query('DELETE FROM mock_table WHERE id = ?', [id]);
    }
    res.json({
      code: 200,
      msg: '真实数据库：删除成功'
    });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ code: 500, msg: 'Internal Server Error' });
  }
});

// 初始化任务表
async function initTaskTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS task_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        assignee VARCHAR(100),
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(50) DEFAULT 'medium',
        createDate VARCHAR(50),
        dueDate VARCHAR(50),
        startDate VARCHAR(50),
        completedDate VARCHAR(50),
        completed TINYINT(1) DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 检查是否有数据，如果没有则插入初始数据
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM task_table');
    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO task_table (title, description, assignee, status, priority, createDate, dueDate, startDate, completedDate, completed) VALUES
        ('设计新功能界面', '为新功能模块设计用户界面，包括主要页面布局和交互流程', '张三', 'pending', 'high', '2023-05-01', '2023-05-20', NULL, NULL, 0),
        ('开发用户认证模块', '实现用户注册、登录、权限验证等功能', '李四', 'in-progress', 'high', '2023-05-02', '2023-05-25', '2023-05-10', NULL, 0),
        ('编写API文档', '为已开发的API接口编写详细文档', '王五', 'completed', 'medium', '2023-04-28', '2023-05-10', NULL, '2023-05-09', 1),
        ('测试系统性能', '对系统进行压力测试，找出性能瓶颈', '赵六', 'pending', 'medium', '2023-05-05', '2023-05-30', NULL, NULL, 0),
        ('修复已知bug', '修复用户反馈的几个重要bug', '钱七', 'in-progress', 'high', '2023-05-03', '2023-05-18', '2023-05-12', NULL, 0)
      `);
      console.log('Task table initialized with mock data.');
    }
  } catch (error) {
    console.error('Failed to init task table:', error);
  }
}
initTaskTable();

// ================= 任务管理相关接口 =================

// 获取任务列表
app.get('/task/getList', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM task_table ORDER BY id DESC');
    const formattedRows = rows.map(row => ({
      ...row,
      completed: row.completed === 1
    }));
    res.json({ code: 200, msg: 'success', data: formattedRows });
  } catch (error) {
    console.error('Task GetList Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

// 添加任务
app.post('/task/doAdd', async (req, res) => {
  try {
    const { title, description, assignee, status, priority, createDate, dueDate } = req.body;
    await pool.query(
      'INSERT INTO task_table (title, description, assignee, status, priority, createDate, dueDate, completed) VALUES (?, ?, ?, ?, ?, ?, ?, 0)',
      [title, description, assignee, status, priority, createDate, dueDate]
    );
    res.json({ code: 200, msg: '真实数据库：添加任务成功' });
  } catch (error) {
    console.error('Task Add Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

// 编辑任务
app.post('/task/doEdit', async (req, res) => {
  try {
    const { id, title, description, assignee, status, priority, dueDate, startDate, completedDate, completed } = req.body;
    await pool.query(
      'UPDATE task_table SET title = ?, description = ?, assignee = ?, status = ?, priority = ?, dueDate = ?, startDate = ?, completedDate = ?, completed = ? WHERE id = ?',
      [title, description, assignee, status, priority, dueDate, startDate || null, completedDate || null, completed ? 1 : 0, id]
    );
    res.json({ code: 200, msg: '真实数据库：更新任务成功' });
  } catch (error) {
    console.error('Task Edit Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

// 删除任务
app.post('/task/doDelete', async (req, res) => {
  try {
    const { id } = req.body;
    await pool.query('DELETE FROM task_table WHERE id = ?', [id]);
    res.json({ code: 200, msg: '真实数据库：删除任务成功' });
  } catch (error) {
    console.error('Task Delete Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

// 初始化会议室申请表
async function initMeetingTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meeting_application (
        id INT AUTO_INCREMENT PRIMARY KEY,
        applicant VARCHAR(100) NOT NULL,
        room VARCHAR(255) NOT NULL,
        startTime DATETIME NOT NULL,
        endTime DATETIME NOT NULL,
        attendees INT NOT NULL,
        meetingName VARCHAR(255) NOT NULL,
        branchLeaders VARCHAR(255) DEFAULT '',
        status ENUM('确认', '取消', '待审批') DEFAULT '确认',
        submitTime DATETIME NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    const [rows] = await pool.query('SELECT COUNT(*) as count FROM meeting_application');
    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO meeting_application (id, applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES
        (9419, '滕晓龙', '01号楼二楼会议室', '2024-05-15 08:00:00', '2024-05-15 17:00:00', 60, '全重实验室年会', '', '确认', '2024-04-02 08:44:00'),
        (9458, '滕晓龙', '01号楼二楼会议室', '2024-05-13 13:00:00', '2024-05-13 17:00:00', 60, '“科学与中国——双千报告”', '', '确认', '2024-04-22 15:46:00'),
        (9455, '朱泰来', '11号楼二楼会议室', '2024-04-30 13:00:00', '2024-04-30 17:00:00', 20, '青咖沙龙', '', '确认', '2024-04-21 16:50:00'),
        (9465, '滕晓龙', '01号楼二楼会议室', '2024-04-30 13:00:00', '2024-04-30 17:00:00', 10, '基础局工作会议', '', '确认', '2024-04-27 12:06:00'),
        (9466, '滕晓龙', '01号楼一楼会议室', '2024-04-30 13:00:00', '2024-04-30 17:00:00', 10, '基础局工作会议', '', '确认', '2024-04-27 12:08:00'),
        (9468, '陈寅', '11号楼一楼会议室', '2024-04-29 13:00:00', '2024-04-29 17:00:00', 20, '览岳沙龙', '', '确认', '2024-04-27 15:22:00'),
        (9472, '陈寅', '22号楼201会议室', '2024-04-29 09:00:00', '2024-04-29 12:00:00', 10, '科技合作处工作交流', '', '确认', '2024-04-28 11:22:00'),
        (9469, '陈寅', '11号楼二楼会议室', '2024-04-29 08:00:00', '2024-04-29 17:00:00', 20, '先导专项汇报', '', '取消', '2024-04-27 15:32:00'),
        (9470, '陈寅', '01号楼二楼会议室', '2024-04-29 08:00:00', '2024-04-29 17:00:00', 20, '先导B项目汇报', '', '确认', '2024-04-27 16:17:00'),
        (9473, '薛芳', '22号楼201会议室', '2024-04-28 14:30:00', '2024-04-28 17:00:00', 5, '支部会', '', '确认', '2024-04-28 11:25:00'),
        (9471, '陈寅', '22号楼504会议室', '2024-04-28 09:00:00', '2024-04-28 12:00:00', 7, '科技处工作会议', '', '确认', '2024-04-27 20:17:00'),
        (9447, '杜奇', '22号楼504会议室', '2024-04-28 09:00:00', '2024-04-28 11:30:00', 25, '中国科学院上海分院-兰州分院资产管理工作交流会', '', '取消', '2024-04-17 14:03:00'),
        (9454, '王晓霞', '01号楼二楼会议室', '2024-04-28 08:00:00', '2024-04-28 11:00:00', 50, '上海分院、兰州分院资产管理工作交流会', '', '确认', '2024-04-21 15:01:00'),
        (9464, '薛芳', '22号楼201会议室', '2024-04-28 08:00:00', '2024-04-28 11:00:00', 6, '技能大赛筹备会', '', '确认', '2024-04-27 10:27:00'),
        (9467, '居文君', '22号楼301会议室', '2024-04-27 14:00:00', '2024-04-27 17:00:00', 3, '五四大会讨论', '', '确认', '2024-04-27 13:21:00')
      `);
      console.log('Meeting table initialized with real data.');
    }
  } catch (error) {
    console.error('Failed to init meeting table:', error);
  }
}
initMeetingTable();

// ================= 会议室申请相关接口 =================

// 获取会议室申请列表
app.post('/meeting/getList', async (req, res) => {
  try {
    const { room, startDate, endDate, startTime, endTime, pageNo = 1, pageSize = 20 } = req.body;
    let query = 'SELECT * FROM meeting_application WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM meeting_application WHERE 1=1';
    const params = [];

    if (room) {
      query += ' AND room = ?';
      countQuery += ' AND room = ?';
      params.push(room);
    }
    if (startDate) {
      query += ' AND DATE(startTime) >= ?';
      countQuery += ' AND DATE(startTime) >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND DATE(startTime) <= ?';
      countQuery += ' AND DATE(startTime) <= ?';
      params.push(endDate);
    }
    if (startTime) {
      query += ' AND TIME(startTime) >= ?';
      countQuery += ' AND TIME(startTime) >= ?';
      params.push(startTime);
    }
    if (endTime) {
      query += ' AND TIME(startTime) <= ?';
      countQuery += ' AND TIME(startTime) <= ?';
      params.push(endTime);
    }

    query += ' ORDER BY id DESC';

    // 获取总数
    const [countRows] = await pool.query(countQuery, params);
    const totalCount = countRows[0].total;

    // 分页
    query += ' LIMIT ? OFFSET ?';
    params.push(Number(pageSize), (Number(pageNo) - 1) * Number(pageSize));

    const [rows] = await pool.query(query, params);

    res.json({
      code: 200,
      msg: 'success',
      totalCount,
      data: rows
    });
  } catch (error) {
    console.error('Meeting GetList Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

// 添加会议室申请
app.post('/meeting/doAdd', async (req, res) => {
  try {
    const { applicant, room, startTime, endTime, attendees, meetingName, branchLeaders } = req.body;
    const submitTime = new Date();
    await pool.query(
      'INSERT INTO meeting_application (applicant, room, startTime, endTime, attendees, meetingName, branchLeaders, status, submitTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [applicant, room, startTime, endTime, attendees, meetingName, branchLeaders || '', '待审批', submitTime]
    );
    res.json({ code: 200, msg: '真实数据库：添加会议室申请成功' });
  } catch (error) {
    console.error('Meeting Add Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

// 更新状态 (审批或取消)
app.post('/meeting/updateStatus', async (req, res) => {
  try {
    const { id, status } = req.body;
    await pool.query('UPDATE meeting_application SET status = ? WHERE id = ?', [status, id]);
    res.json({ code: 200, msg: '真实数据库：状态更新成功' });
  } catch (error) {
    console.error('Meeting UpdateStatus Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

// 删除会议室申请
app.post('/meeting/doDelete', async (req, res) => {
  try {
    const { id } = req.body;
    await pool.query('DELETE FROM meeting_application WHERE id = ?', [id]);
    res.json({ code: 200, msg: '真实数据库：删除成功' });
  } catch (error) {
    console.error('Meeting Delete Error:', error);
    res.status(500).json({ code: 500, msg: 'Error' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Real Backend Server is running on http://localhost:${PORT}`);
});
