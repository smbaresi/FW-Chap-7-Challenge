const {
    User,
    History,
    Room,
    sequelize,
} = require("../models")

let playerOne = ""
let playerTwo = ""
let playerOneInput = ""
let playerTwoInput = ""
let round = 1
let hasil = {}
let playerOneScore = 0
let playerTwoScore = 0


const suit = (player, comp) => {
    if (player === comp) return "draw"
    else if (player === "gunting") {
        if (comp === "kertas") return "player 1"
        else if (comp !== "kertas") return "player 2"
    } else if (player === "batu") {
        return comp === "kertas" ? "player 2" : "player 1"
    } else if (player === "kertas") {
        return comp === "batu" ? "player 1" : "player 2"
    }
}

module.exports = {
    register: (req, res, next) => {
        User.register(req.body)
            .then((check) => {
                if (check) {
                    res.send({
                        message: "register succeed"
                    })

                } else {
                    res.send({
                        message: "something wrong"
                    })
                }
            })
            .catch((err) => {
                res.send({
                    message: "something went wrong"
                })

            })
    },

    login: (req, res) => {

        User.authenticate(req.body)
            .then(authResult => {
                const {
                    id,
                    userName
                } = authResult
                const data = {
                    id,
                    userName,
                    token: authResult.generateToken()
                }
                res.send(data)
            })
            .catch(err => {
                res.send({
                    message: err.message
                });
            })

    },
    loginAdmin: (req, res) => {

        User.authenticate(req.body)
            .then(authResult => {
                const {
                    id,
                    username
                } = authResult
                const data = {
                    id,
                    username,
                    token: authResult.generateToken()
                }
                res.redirect('/dashboard')

            })
            .catch(err => {
                res.send({
                    message: err.message
                });
            })

    },
    whoami: async (req, res) => {
        const currentUser = req.user;
        const {
            id,
            username
        } = currentUser;
        let history = await History.getHistory(id);
        res.send({
            id,
            username,
            history
        })
    },
    createRoom: (req, res) => {
        Room.generate(req.body.name)
            .then(room => {
                res.send(room)
            })
            .catch(err => {
                res.send({
                    message: `${err.message}. Maybe name is duplicate.`
                });
            })
    },
    fight: (req, res) => {
        const currentPlayer = req.user;

        if (playerOne === "") {
            playerOne = currentPlayer
        } else if (playerTwo === "") {
            playerTwo = currentPlayer
        }

        if (currentPlayer.id == playerOne.id) {
            playerOneInput = req.body.option
        } else if (currentPlayer.id == playerTwo.id) {
            playerTwoInput = req.body.option
        }

        if (playerTwoInput && playerOneInput) {
            let hasilSuit = suit(playerOneInput, playerTwoInput)
            if (hasilSuit === "draw") {

            } else if (hasilSuit === "player 1") {
                playerOneScore += 1
            } else if (hasilSuit === "player 2") {
                playerTwoScore += 1
            }

            hasil = {
                playerOne: {
                    id: playerOne.id,
                    score: playerOneScore,
                    username: playerOne.userName
                },
                playerTwo: {
                    id: playerTwo.id,
                    score: playerTwoScore,
                    username: playerTwo.userName
                }
            }
            playerTwoInput = ""
            playerOneInput = ""

            if (round === 3) {
                round = 1;
                const {
                    roomID
                } = req.params;
                sequelize.transaction(t => {
                    return History.create({
                        player_id: parseInt(hasil.playerOne.id),
                        room_id: roomID,
                        result: hasil.playerOne.score
                    }, {
                        transaction: t
                    }).then(() => {
                        return History.create({
                            player_id: parseInt(hasil.playerTwo.id),
                            room_id: roomID,
                            result: hasil.playerTwo.score
                        }, {
                            transaction: t
                        });
                    })
                }).then(() => {
                    let w = ""
                    if (playerOneScore > playerTwoScore) {
                        w = hasil.playerOne.username 
                    } else {
                        w = hasil.playerTwo.username
                    }
                    hasil["winner"] = w
                    let temp = hasil
                    hasil = {}
                    playerOne = ""
                    playerTwo = ""
                    playerOneInput = ""
                    playerTwoInput = ""
                    round = 1
                    playerOneScore = 0
                    playerTwoScore = 0
                    res.send(temp)
                }).catch(err => {
                    hasil = {}
                    playerOne = ""
                    playerTwo = ""
                    playerOneInput = ""
                    playerTwoInput = ""
                    round = 1
                    playerOneScore = 0
                    playerTwoScore = 0
                    res.send(err)
                });
            } else {
                round++;
                res.send(hasil)
            }

        } else {
            console.log(playerOneInput, playerTwoInput)
            res.send('waiting for other player input')
        }
    },
}