CREATE DATABASE IF NOT EXISTS vue3_admin DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE vue3_admin;

CREATE TABLE IF NOT EXISTS `mock_table` (
  `id` VARCHAR(64) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `status` ENUM('published', 'draft', 'deleted') DEFAULT 'published',
  `author` VARCHAR(100) NOT NULL,
  `datetime` DATETIME NOT NULL,
  `pageViews` INT DEFAULT 0,
  `img` VARCHAR(255),
  `smallImg` VARCHAR(255),
  `switch` TINYINT(1) DEFAULT 1,
  `percent` INT DEFAULT 100
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `mock_table` (`id`, `title`, `status`, `author`, `datetime`, `pageViews`, `img`, `smallImg`, `switch`, `percent`) VALUES
('1', '测试文章一', 'published', '张三', '2023-10-01 10:00:00', 1024, 'https://picsum.photos/200/200?random=1', 'https://picsum.photos/40/40?random=1', 1, 95),
('2', 'Vue3 实战指南', 'draft', '李四', '2023-10-02 14:30:00', 256, 'https://picsum.photos/200/200?random=2', 'https://picsum.photos/40/40?random=2', 0, 80),
('3', 'MySQL 入门', 'published', '王五', '2023-10-03 09:15:00', 4096, 'https://picsum.photos/200/200?random=3', 'https://picsum.photos/40/40?random=3', 1, 99),
('4', 'Docker 容器化部署', 'deleted', '赵六', '2023-10-04 16:45:00', 128, 'https://picsum.photos/200/200?random=4', 'https://picsum.photos/40/40?random=4', 0, 60),
('5', 'Node.js 后端开发', 'published', '钱七', '2023-10-05 11:20:00', 2048, 'https://picsum.photos/200/200?random=5', 'https://picsum.photos/40/40?random=5', 1, 90);
