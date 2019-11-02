
module.exports = {
  run: (models)=>{
    models.Location.hasOne(models.Building);
    models.Location.hasOne(models.Institution);
    models.Lab.hasOne(models.Location);
    models.User.hasOne(models.Location);
    models.User.hasOne(models.Lab);
    models.User.hasOne(models.Department);
    models.Order.belongsTo(models.Inventory);
    models.Order.belongsTo(models.User);
  }
};