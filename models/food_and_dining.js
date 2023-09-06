'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food_and_Dining extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define the association with the Users model
      Food_and_Dining.belongsTo(models.Users, {
        foreignKey: 'UserID', // The name of the foreign key column in the Food_and_Dining table
        onDelete: 'CASCADE', // Set the onDelete behavior as needed
        onUpdate: 'CASCADE' // Set the onUpdate behavior as needed
      });
    }
  }
  Food_and_Dining.init({
    Description: DataTypes.STRING,
    Amount: DataTypes.INTEGER,
    UserID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Food_and_Dining',
  });
  return Food_and_Dining;
};