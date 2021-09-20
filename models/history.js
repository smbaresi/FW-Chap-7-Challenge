'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    static getHistory=(id) => {
      return History.findAll({
        where: {
          player_id: id
        },
        attributes: [
          'id',
          'room_id',
          'result',
          'createdAt'
        ]
      })
    }
  };
  History.init({
    player_id: DataTypes.INTEGER,
    room_id: DataTypes.STRING,
    result: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt:DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};