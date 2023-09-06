'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entertainment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Entertainment.init({
    Description: DataTypes.STRING,
    Amount: DataTypes.INTEGER,
    UserID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Entertainment',
  });
  return Entertainment;
};