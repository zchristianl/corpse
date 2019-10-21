module.exports = (sequelize, type) => sequelize.define('lab', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  pi_first: type.STRING,
  pi_last: type.STRING,
  pi_email: type.STRING,
  phone: type.VARCHAR(12),
  registration: type.DATE

  //Foreign Keys
  // location

});