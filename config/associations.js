
module.exports = {
  run: (models)=>{

    models.Location.hasOne(models.Building);
    models.Location.hasOne(models.Institution);
    models.Lab.hasOne(models.Location);
    models.Client.hasOne(models.Location);
    models.Client.hasOne(models.Lab);
    models.Client.hasOne(models.Department);
  }
};