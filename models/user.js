module.exports = (sequelize, type) => sequelize.define('user', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: type.STRING,
  username: type.STRING,
  email: type.STRING,
  password: type.STRING,
  first: type.STRING,
  last: type.STRING,
  email: type.STRING,
  title: type.STRING(10), //10
  phone: type.STRING(12) //12
  //Foreign Keys
  //dept, lab, location, linked user????
});
