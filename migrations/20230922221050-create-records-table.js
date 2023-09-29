'use strict';

module.exports = {
  up(queryInterface) {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS records (
        id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,

        clientId INTEGER UNSIGNED NOT NULL,
        barberId INTEGER UNSIGNED NOT NULL,
        favorId INTEGER UNSIGNED NOT NULL,
        date DATE NOT NULL,
        startsAt TIME NOT NULL,
        endsAt TIME NOT NULL,

        createdAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY clientIdFk (clientId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY barberIdFk (barberId) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY favorIdFk (favorId) REFERENCES favors (id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=INNODB CHARACTER SET=UTF8MB4 COLLATE UTF8MB4_UNICODE_CI;
    `
      .replace(/\s+/gi, ' ')
      .trim();

    return queryInterface.sequelize.query(createTableSql);
  },

  down(queryInterface) {
    return queryInterface.sequelize.query('DROP TABLE IF EXISTS records;');
  },
};
