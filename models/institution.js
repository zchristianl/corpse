module.exports = (sequelize, type) => sequelize.define('institution', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: type.STRING,
  address: type.STRING,
  city: type.STRING,
  post_code: type.STRING(6),
  state: type.STRING(3)
});