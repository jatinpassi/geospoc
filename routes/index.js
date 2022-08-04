var express = require("express");
var router = express.Router();
const logger = require("../helper/logger");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});

module.exports = router;
