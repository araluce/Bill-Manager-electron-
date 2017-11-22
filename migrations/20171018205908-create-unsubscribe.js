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
        allowNull: false,
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
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Unsubscribes');
  }
};