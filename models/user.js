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
  organization: type.STRING,
  research_area: type.ENUM('cancer', 'neuroscience', 'stem_cell', 'virology', 'epigenetics', 'cardiovascular_disease'),
  address: type.STRING,
  city: type.STRING,
  state: type.STRING(2),
  zip: type.STRING(5),
  payment: type.ENUM('check', 'po', 'cc'),
  po_num: type.STRING,
  resetPasswordToken: type.STRING,
  resetPasswordExpires: type.DATE
  //Foreign Keys
  //dept, lab, location, linked user????
});
