'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Retires', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bill_id: {
        type: Sequelize.INTEGER
      },
      date_output: {
        type: Sequelize.DATE
      },
      date_consumption: {
        type: Sequelize.DATE
      },
      destination: {
        type: Sequelize.STRING
      },
      tagged: {
        type: Sequelize.STRING
      },
      num_hams: {
        type: Sequelize.INTEGER
      },
      num_palettes: {
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('Retires');
  }
};