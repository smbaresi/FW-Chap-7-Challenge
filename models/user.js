'use strict';

const { 
  hashSync,compareSync
 } = require("bcrypt")
require("dotenv").config()
 const jwt = require("jsonwebtoken")

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
    static #encrypt = (password) => hashSync(password, 10) 
    
    static register = ({ userName, password, role }) => {
        const encryptedPassword = this.#encrypt(password)
        return User.create({ userName, role, password: encryptedPassword });
    } 

    checkPassword = (password) => compareSync(password, this.password);
    generateToken = () => {
        const payload = {
            id: this.id,
            userName: this.userName,
            role: this.role,
        }
        const _secret = process.env.JWT_SECRET;

        const token = jwt.sign(payload, _secret);
        return token;
    }

    static authenticate = async ({ userName, password }) => {
        try {
            const user = await this.findOne({ where: { userName } });
            if (!user) return Promise.reject("User not found");

            const isPasswordValid = user.checkPassword(password);
            if (!isPasswordValid) return Promise.reject("Wrong Password");

            return Promise.resolve(user);
        } catch (err) {
            return Promise.reject(err);
        }
    }
  };

  User.init({
    userName: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};

