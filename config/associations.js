module.exports = {
  run: (models)=>{
    models.Location.belongsTo(models.Building);
    models.Location.belongsTo(models.Institution);
    models.Lab.belongsTo(models.Location);
    //models.User.belongsTo(models.Location);
    models.Lab.hasMany(models.User);
    models.User.belongsTo(models.Department);
    models.Order.belongsTo(models.User);
    models.Item.belongsTo(models.Inventory);
    models.Item.belongsTo(models.Order);
    models.Payment.belongsTo(models.Order);
    models.Order.hasMany(models.Payment);
    models.Order.hasMany(models.Item);
  }
};