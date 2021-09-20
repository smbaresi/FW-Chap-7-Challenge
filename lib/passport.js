const Passport = require("passport").Passport;
const {
    Strategy: JwtStrategy,
    ExtractJwt
} = require("passport-jwt")
require("dotenv").config()

const {
    User
} = require("../models")

const options = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: process.env.JWT_SECRET
}

const passportPlayer = new Passport()
const passportAdmin = new Passport()

passportAdmin.use(new JwtStrategy(options, async (payload, done) => {
    User.findOne({
            where: {
                id: payload.id,
                role: "superAdmin"
            }
        })
        .then(user => done(null, user))
        .catch(err => done(err, false))
}))

passportPlayer.use(new JwtStrategy(options, async (payload, done) => {
    User.findOne({
            where: {
                id: payload.id,
                role: "playerUser"
            }
        })
        .then(user => done(null, user))
        .catch(err => done(err, false))
}))

module.exports = {
    passportAdmin,
    passportPlayer
}