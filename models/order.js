module.exports = (sequelize, type) => sequelize.define('order', {
  id: {
    type: type.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  amount: {
    type: type.DECIMAL(10, 2),
    defaultValue: 0
  },
  state: type.ENUM('NEW', 'ESTIMATE', 'IN-PROGRESS', 'PAYMENT', 'COMPLETE'),
  inquiry_type: type.ENUM('estimate', 'quote', 'grant'),
  time_estimate: type.ENUM('immediately', '1-3', '3-6', '6_or_more'),
  intended_use: type.ENUM('research_only', 'clinical_applications'),
  payment: type.ENUM('cc', 'check', 'po'),
  po_num: type.STRING,
  checkout_id: type.STRING
});
