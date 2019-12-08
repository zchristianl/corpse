module.exports = (sequelize, type) => sequelize.define('payment', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  reference_number: {
    type: type.STRING,
  },
  method: type.ENUM('cc', 'po', 'check'),
  amount: type.DECIMAL(10, 2)
});
