'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventInvitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EventInvitation.init({
    user_id: DataTypes.STRING,
    event_id: DataTypes.STRING,
    inviteuser: DataTypes.STRING,
    isread: DataTypes.INTEGER,
    yes: DataTypes.INTEGER,
    no: DataTypes.INTEGER,
    feedback: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'EventInvitation',
  });
  return EventInvitation;
};