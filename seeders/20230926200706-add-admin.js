const crypto = require('crypto');

module.exports = {
  async up(queryInterface) {
    const salt = crypto.randomBytes(16).toString('hex');
    const password = crypto
      .createHash('sha256')
      .update('Admin123' + salt)
      .digest('hex');
    return queryInterface.sequelize.query(`
            INSERT INTO users (firstName, lastName, email, password, salt, role)
            values ('Admin', 'Admin', 'admin${Math.floor(
              Math.random() * 1000,
            )}@admin.com', '${password}', '${salt}', 3);
        `);
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
                DELETE FROM users
                    WHERE email = '%@admin.com';
        `);
  },
};
