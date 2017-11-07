'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        validate: {len: [3, 20]}
      },
      lastName: {
        type: Sequelize.STRING,
        validate: {len: [3, 50]}
      },
      dni: {
        type: Sequelize.STRING,
        notEmpty: true,
        validate: { len: 9},
        unique: true
      },
      phone: {
        type: Sequelize.INTEGER,
        validate: {len: [9, 15]}
      },
      deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false, 
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Clients');
  }
};