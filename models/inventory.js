module.exports = (sequelize, type) => {
  return sequelize.define('inventory', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING,
      allowNull: false,
    },
    category: type.STRING,
    type: type.ENUM('product', 'service'),
    description: type.TEXT,
    cost: type.DECIMAL(10, 2),
    price: type.DECIMAL(10, 2),
    stock: {
      type: type.INTEGER
    }
  });
};