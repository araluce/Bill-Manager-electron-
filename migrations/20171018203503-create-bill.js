'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Bills', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      client_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      origin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      n_rsi: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      date_input: {
        type: Sequelize.DATE
      },
      lot_number: {
        type: Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.FLOAT
      },
      price: {
        type: Sequelize.FLOAT
      },
      t_reception: {
        type: Sequelize.STRING
      },
      num_hams: {
        type: Sequelize.INTEGER
      },
      num_palettes: {
        type: Sequelize.INTEGER
      },
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
    return queryInterface.dropTable('Bills');
  }
};