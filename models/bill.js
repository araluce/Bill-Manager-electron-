'use strict';
module.exports = (sequelize, DataTypes) => {
  var Bill = sequelize.define('Bill', {
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    n_rsi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
      classMethods: {
        associate: function (models) {
          Bill.belongs_to(models.Client, {
            onDelete: "CASCADE",
            foreignKey: 'clien_id',
            foreignKeyConstraint: true,
          });
          Bill.has_one(models.Receipt);
          Bill.has_many(models.Unsubscribe);
          Bill.has_many(models.retire);
        }
      }
    });
  return Bill;
};