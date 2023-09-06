'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bills_and_Utilities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define the association with the Users model
      Bills_and_Utilities.belongsTo(models.Users, {
        foreignKey: 'UserID', // The name of the foreign key column in the Bills_and_Utilities table
        onDelete: 'CASCADE', // Set the onDelete behavior as needed
        onUpdate: 'CASCADE' // Set the onUpdate behavior as needed
      });
    }
  }
  Bills_and_Utilities.init({
    Description: DataTypes.STRING,
    Amount: DataTypes.INTEGER,
    UserID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Bills_and_Utilities',
  });
  return Bills_and_Utilities;
};