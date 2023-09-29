'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE users
        ADD COLUMN avatarId INTEGER UNSIGNED NULL,
        
        ADD CONSTRAINT avatarIdFk FOREIGN KEY (avatarId) REFERENCES files (id) ON DELETE CASCADE ON UPDATE CASCADE;
    `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
      ALTER TABLE users
        DROP avatarId,
        DROP FOREIGN KEY avatarIdFk;
    `);
  },
};
