'use strict';

module.exports = {
  up(queryInterface) {
    const createUsersTableSql = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,

        firstName VARCHAR(20) NULL,
        lastName VARCHAR(20) NULL,
        email VARCHAR(129) NOT NULL UNIQUE,
        role TINYINT NOT NULL DEFAULT 1 COMMENT '1 - seeker, 2 - employer, 3 - admin',
        password VARCHAR(255) NULL,
        salt VARCHAR(32) NULL,
        isVerified BOOLEAN NOT NULL DEFAULT FALSE,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
    `
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createUsersTableSql);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS users;');
  },
};
