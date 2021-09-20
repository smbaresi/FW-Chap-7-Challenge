'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Biodata', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
        references: {
          model: {
            tableName: 'Users',
          },
          key: 'id',
        },
        onDelete: 'cascade',
      },
      gender: {
        type: Sequelize.ENUM,
        values: ['male','female']
      },
      dob: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Biodata');
  }
};