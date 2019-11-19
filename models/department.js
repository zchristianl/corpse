module.exports = (sequelize, type) => sequelize.define('department', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: type.STRING
});