'use strict';

module.exports = {
  up(queryInterface) {
    const createFilesTableSql = `
      CREATE TABLE IF NOT EXISTS files (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        
        userId INTEGER UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        fileKey VARCHAR(255) NOT NULL,
        status TINYINT NOT NULL DEFAULT 1 COMMENT '1 - pending, 2 - loaded',
        type TINYINT NOT NULL,
        isUsed BOOLEAN NOT NULL DEFAULT FALSE,
        isResized BOOLEAN NOT NULL DEFAULT FALSE,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY userIdFk (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
    `
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createFilesTableSql);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS files;');
  },
};
