'use strict';
module.exports = (sequelize, DataTypes) => {
  var Client = sequelize.define('Client', {
    firstName: {
      type: DataTypes.STRING,
      validate: {len: [3, 20]}
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {len: [3, 50]}
    },
    dni: {
      type: DataTypes.STRING,
      notEmpty: true,
      validate: {len: 9}
    },
    phone: {
      type: DataTypes.INTEGER,
      validate: {len: [9, 15]}
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false, 
      defaultValue: false
    },
  }, {
    classMethods: {
      associate: function(models) {
        Client.has_many(models.Bill);
      }
    }
  });
  return Client;
};