'use strict';

module.exports = {
  up(queryInterface) {
    const creatTableSql = `
      CREATE TABLE IF NOT EXISTS favors (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,

        name VARCHAR(100) NOT NULL,
        description VARCHAR(500) NOT NULL,
        price INTEGER UNSIGNED NOT NULL,
        duration INTEGER UNSIGNED NOT NULL COMMENT 'duration of service in minutes',

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
    `
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(creatTableSql);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS favors;');
  },
};
