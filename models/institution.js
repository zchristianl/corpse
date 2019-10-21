module.exports = (sequelize, type) => sequelize.define('institution', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: type.STRING,
  address: type.STRING,
  city: type.STRING,
  state: type.VARCHAR(2)



});