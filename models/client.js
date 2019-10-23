module.exports = (sequelize, type) => sequelize.define('client', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first: type.STRING,
  last: type.STRING,
  email: type.STRING,
  title: type.STRING(10), //10
  phone: type.STRING(12), //12
  registration: type.DATE


  //Foreign Keys
  //dept, lab, location, linked user????
});