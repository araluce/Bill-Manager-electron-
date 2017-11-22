'use strict';
module.exports = (sequelize, DataTypes) => {
  var Retire = sequelize.define('Retire', {
    bill_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_output: DataTypes.DATE,
    date_consumption: DataTypes.DATE,
    destination: DataTypes.STRING,
    tagged: DataTypes.STRING,
    for: DataTypes.STRING,
    num_hams: DataTypes.INTEGER,
    num_palettes: DataTypes.INTEGER,
    deleted: DataTypes.BOOLEAN
  });
  
  Retire.associate = (models) => {
    Retire.belongsTo(models.Bill, {
      as: 'bill',
      onDelete: "CASCADE",
      foreignKey: 'bill_id',
      foreignKeyConstraint: true,
    });
  };
  return Retire;
};