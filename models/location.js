module.exports = (sequelize, type) => sequelize.define('location', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room: type.INTEGER
  //Foreign keys
  // building, institution(nullable)
});