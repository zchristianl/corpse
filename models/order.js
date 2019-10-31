module.exports = (sequelize, type) => sequelize.define('order', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  payment_number: {
    type: type.INTEGER,
  },
  payment_type: type.INTEGER, //check,stripe,PO
  amount: type.INTEGER
  //inventory, user
});
