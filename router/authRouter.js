const router = require("express").Router();
const auth = require("../controllers/authController");
const {
    restrictAdmin,
    restrictPlayer
} = require("../middlewares/restrict")

router.get("/dashboard", restrictAdmin, (req, res) => res.render("dashboard"))

router.use(restrictPlayer)
router.post("/create-room", auth.createRoom)
router.post("/fight/:roomID", auth.fight)
router.get("/history", auth.whoami)

module.exports = router