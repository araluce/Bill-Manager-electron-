'use strict';
module.exports = (sequelize, DataTypes) => {
  var Unsubscribe = sequelize.define('Unsubscribe', {
    bill_id: DataTypes.INTEGER,
    date_unsubscribe: DataTypes.DATE,
    reason: DataTypes.STRING,
    observations: DataTypes.STRING,
    num_hams: DataTypes.INTEGER,
    num_palettes: DataTypes.INTEGER,
    deleted: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        Unsubscribe.belongs_to(models.Bill, {
          onDelete: "CASCADE",
          foreignKey: 'bill_id',
          foreignKeyConstraint: true,
        });
        Bill.has_many(models.retire);
      }
    }
  });
  return Unsubscribe;
};