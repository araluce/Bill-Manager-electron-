'use strict';
module.exports = (sequelize, DataTypes) => {
  var Receipt = sequelize.define('Receipt', {
    bill_id: DataTypes.INTEGER,
    date_input: DataTypes.DATE,
    lot_number: DataTypes.INTEGER,
    weight: DataTypes.FLOAT,
    price: DataTypes.FLOAT,
    t_reception: DataTypes.STRING,
    num_hams: DataTypes.INTEGER,
    num_palettes: DataTypes.INTEGER,
    deleted: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        Receipt.belongs_to(models.Bill, {
          onDelete: "CASCADE",
          foreignKey: 'bill_id',
          foreignKeyConstraint: true,
        });
      }
    }
  });
  return Receipt;
};