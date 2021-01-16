const projects = require("./seedfiles/projects");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("project", projects);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
