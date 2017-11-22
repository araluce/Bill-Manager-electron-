'use strict';
module.exports = (sequelize, DataTypes) => {
  var Unsubscribe = sequelize.define('Unsubscribe', {
    bill_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_unsubscribe: DataTypes.DATE,
    reason: DataTypes.STRING,
    observations: DataTypes.STRING,
    num_hams: DataTypes.INTEGER,
    num_palettes: DataTypes.INTEGER,
    deleted: DataTypes.BOOLEAN
  });
  Unsubscribe.associate = (models) => {
    Unsubscribe.belongsTo(models.Bill, {
      as: 'bill',
      onDelete: "CASCADE",
      foreignKey: 'bill_id',
      foreignKeyConstraint: true,
    });
  };
  return Unsubscribe;
};