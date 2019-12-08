module.exports = (sequelize, type) => sequelize.define('note', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  message: {
    type: type.STRING(500),
    allowNull: false
  }
});