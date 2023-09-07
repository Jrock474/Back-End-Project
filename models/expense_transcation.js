'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense_Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define the association with the Users model
      Expense_Transaction.belongsTo(models.Users, {
        foreignKey: 'UserID', // The name of the foreign key column in the Expense_Transaction table
        onDelete: 'CASCADE', // Set the onDelete behavior as needed
        onUpdate: 'CASCADE' // Set the onUpdate behavior as needed
      });
    }
  }
  Expense_Transaction.init({
    Description: DataTypes.STRING,
    Amount: DataTypes.INTEGER,
    UserID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Expense_Transaction',
  });
  return Expense_Transaction;
};
