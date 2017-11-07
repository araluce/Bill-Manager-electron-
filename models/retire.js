'use strict';
module.exports = (sequelize, DataTypes) => {
  var Retire = sequelize.define('Retire', {
    bill_id: DataTypes.INTEGER,
    date_output: DataTypes.DATE,
    date_consumption: DataTypes.DATE,
    destination: DataTypes.STRING,
    tagged: DataTypes.STRING,
    num_hams: DataTypes.INTEGER,
    num_palettes: DataTypes.INTEGER,
    deleted: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        Retire.belongs_to(models.Bill, {
          onDelete: "CASCADE",
          foreignKey: 'bill_id',
          foreignKeyConstraint: true,
        });
      }
    }
  });
  return Retire;
};