module.exports = {
  run: (models)=>{
    models.Location.belongsTo(models.Building);
    models.Location.belongsTo(models.Institution);
    models.Lab.belongsTo(models.Location);
    models.Lab.hasMany(models.User);
    models.User.belongsTo(models.Department);
    models.Order.belongsTo(models.User);
    models.User.hasMany(models.Order);
    models.Item.belongsTo(models.Inventory);
    models.Item.belongsTo(models.Order);
    models.Payment.belongsTo(models.Order);
    models.Order.hasMany(models.Payment);
    models.Order.hasMany(models.Item);
    models.Order.hasMany(models.Note);
    models.Note.belongsTo(models.User);
  }
};