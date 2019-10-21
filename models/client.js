module.exports = (sequelize, type) => sequelize.define('client', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first: type.STRING,
  last: type.STRING,
  email: type.STRING,
  title: type.VARCHAR(10),
  phone: type.VARCHAR(12),
  registration: type.DATE


  //Foreign Keys
  //dept, lab, location, linked user????
});