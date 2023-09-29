'use strict';

module.exports = {
  up(queryInterface) {
    const createVerificationsTableSql = `
      CREATE TABLE IF NOT EXISTS verifications (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,

        userId INTEGER UNSIGNED NOT NULL,
        attempt TINYINT NOT NULL DEFAULT 1,
        type TINYINT NOT NULL DEFAULT 1 COMMENT '1 - email, 2 - resetPassword',
        token VARCHAR(255) NOT NULL,
        isUsed BOOLEAN NOT NULL DEFAULT FALSE,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        FOREIGN KEY userIdFk (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
    `
      .replace(/\\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createVerificationsTableSql);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query(
      'DROP TABLE IF EXISTS verifications;',
    );
  },
};
