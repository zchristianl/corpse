module.exports = (sequelize, type) => sequelize.define('item', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  }
});