'use strict';
module.exports = (sequelize, DataTypes) => {
  var Bill = sequelize.define('Bill', {
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex'
    },
    n_rsi: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex'
    },
    date_input: DataTypes.DATE,
    lot_number: DataTypes.INTEGER,
    weight: DataTypes.FLOAT,
    price: DataTypes.FLOAT,
    t_reception: DataTypes.STRING,
    num_hams: DataTypes.INTEGER,
    num_palettes: DataTypes.INTEGER,
    num_hams_out: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    num_palettes_out: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  });
  Bill.associate = (models) => {
    Bill.belongsTo(models.Client, {
      as: 'client',
      onDelete: "CASCADE",
      foreignKey: 'client_id',
      foreignKeyConstraint: true,
    });
    Bill.hasMany(models.Unsubscribe, { as: 'unsubscribes' });
    Bill.hasMany(models.Retire, { as: 'retires' });
  };
  return Bill;
};