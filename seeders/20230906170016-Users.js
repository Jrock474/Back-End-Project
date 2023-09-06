'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
     await queryInterface.bulkInsert('Users', [{
      Name: "Santi",
      Email: "test@gmail.com",
      Password: "12345",
      ReEnterPassword: "12345",
      Income:100,
      Expenses: 100,
      Net: 0,
      Budget: 0
     }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
