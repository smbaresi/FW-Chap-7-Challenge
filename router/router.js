const router = require("express").Router();
const auth = require("../controllers/authController");
const express = require("express");
router.use(express.static("./public"));

router.get("/", (req, res) => res.render("home", {
    username: "baba"
}))

router.post("/register", auth.register)
router.post("/login", auth.login)


module.exports = router