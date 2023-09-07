'use strict';
/** @type {import('sequelize').QueryInterface} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Expense_Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Description: {
        type: Sequelize.STRING
      },
      Amount: {
        type: Sequelize.INTEGER
      },
      Type: {
        type: Sequelize.STRING
      },
      UserID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // The name of the referenced table
          key: 'id' // The name of the referenced column
        },
        allowNull: false, // Set this to false if you want the foreign key to be required
        onUpdate: 'CASCADE', // Set the onUpdate behavior as needed
        onDelete: 'CASCADE' // Set the onDelete behavior as needed
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Expense_Transactions');
  }
};