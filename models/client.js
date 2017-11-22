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
  });
  Client.associate = (models) => {
    Client.hasMany(models.Bill, {as: 'bills'});
  };

  Client.prototype.fullname = function() {
    return [this.firstName, this.lastName].join(' ');
  };
  return Client;
};