const express = require("express");
const app = express();
const router = require("./router/router");
const authRouter = require("./router/authRouter");
const PORT = 3000;
const {
    passportAdmin,
    passportPlayer
} = require("./lib/passport")
app.use(passportAdmin.initialize())
app.use(passportPlayer.initialize())

app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())
app.set('view engine', 'ejs');
app.use(router);
app.use(authRouter);
app.use(express.static("./public"))


app.listen(PORT, () => {
    console.log("running node on port 3000")
})

