'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Unsubscribes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bill_id: {
        type: Sequelize.INTEGER
      },
      date_unsubscribe: {
        type: Sequelize.DATE
      },
      reason: {
        type: Sequelize.STRING
      },
      observations: {
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
    return queryInterface.dropTable('Unsubscribes');
  }
};