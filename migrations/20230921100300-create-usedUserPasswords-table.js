'use strict';

module.exports = {
  up(queryInterface) {
    const createUsedUserPasswordsTableSql = `
      CREATE TABLE IF NOT EXISTS usedUserPasswords (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,

        userId INTEGER UNSIGNED NOT NULL,
        password VARCHAR(255) NOT NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY userIdFk (userId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
    `
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createUsedUserPasswordsTableSql);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query(
      'DROP TABLE IF EXISTS usedUserPasswords;',
    );
  },
};
