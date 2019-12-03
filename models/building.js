module.exports = (sequelize, type) => sequelize.define('building', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: type.STRING,
  address: type.STRING,
  zip_code: type.INTEGER
});