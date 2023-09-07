'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense_Transcation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Expense_Transcation.init({
    Description: DataTypes.STRING,
    Amount: DataTypes.INTEGER,
    Type: DataTypes.STRING,
    UserID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Expense_Transcation',
  });
  return Expense_Transcation;
};