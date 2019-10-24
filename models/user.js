module.exports = (sequelize, Sequelize) => {
  return sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING,
    username: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING  
  });
};