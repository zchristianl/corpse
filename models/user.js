module.exports = (sequelize, type) => sequelize.define('user', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  first_name: type.STRING,
  last_name: type.STRING,
  email: type.STRING,
  password: type.STRING,
  account_type: type.STRING(10), //12
  phone: type.STRING(12), //12
  resetPasswordToken: type.STRING,
  resetPasswordExpires: type.DATE
  //Foreign Keys
  //dept, lab, location, linked user????
});
