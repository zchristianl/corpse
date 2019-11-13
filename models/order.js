module.exports = (sequelize, type) => sequelize.define('order', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: type.INTEGER,
  state: type.INTEGER //inquiry quote order
  //inventory, user
});
