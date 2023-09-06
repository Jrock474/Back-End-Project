'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Auto_and_Transportation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Auto_and_Transportation.init({
    Description: DataTypes.STRING,
    Amount: DataTypes.INTEGER,
    UserID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Auto_and_Transportation',
  });
  return Auto_and_Transportation;
};