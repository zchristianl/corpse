module.exports = (sequelize, type) => {
  return sequelize.define('inventory', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: type.STRING(256),
      allowNull: false,
    },
    category: type.STRING(256),
    type: type.ENUM('PRODUCT', 'SERVICE'),
    description: {
      type: type.TEXT,
      allowNull: false
    },
    cost: type.DECIMAL(10, 2),
    price: type.DECIMAL(10, 2),
    stock: {
      type: type.INTEGER
    }
  });
};