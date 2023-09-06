'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Health_and_Fitness extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Health_and_Fitness.init({
    Description: DataTypes.STRING,
    Amount: DataTypes.INTEGER,
    UserID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Health_and_Fitness',
  });
  return Health_and_Fitness;
};