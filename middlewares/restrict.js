const {
    passportAdmin,
    passportPlayer
} = require("../lib/passport")

module.exports = {
    restrictAdmin: passportAdmin.authenticate("jwt", {
        session: false
    }),
    restrictPlayer: passportPlayer.authenticate("jwt", {
        session: false
    })
}
