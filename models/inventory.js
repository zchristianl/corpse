module.exports = (sequelize, Sequelize) => {
  return sequelize.define('inventory', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    category: Sequelize.STRING,
    type: Sequelize.ENUM('product', 'service'),
    description: Sequelize.TEXT,
    cost: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    price: Sequelize.DECIMAL
  });
};