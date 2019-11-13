module.exports = (sequelize, type) => sequelize.define('payment', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  payment_number: {
    type: type.INTEGER,
  },
  payment_type: type.INTEGER, //check,stripe,PO
});
