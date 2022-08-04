var express = require("express");
var router = express.Router();
const model = require("../schemas");
const authMiddleware = require("../middlewares/auth");
const gameMiddleware = require("../middlewares/game");
const logger = require("../helper/logger");
const mail = require("../helper/email");

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("game");
});

router.post(
    "/today",
    authMiddleware.JWTChecker,
    gameMiddleware.gameLogic,
    async function (req, res) {
        logger.info("[Game Today Api] [POST]");
        try {
            if (req.user && req.user.attempts < 6) {
                let score =
                    req.roundResult.filter((ele) => ele === "correct").length *
                    2;
                await model.user.updateOne(
                    { email: req.user.email },
                    {
                        $inc: { attempts: 1 },
                        $set: { score },
                        $push: {
                            word_list: req.body.word,
                            guess_list: req.roundResult,
                        },
                    }
                );
                if (score === 10) {
                    mail.sendMail(
                        "req.user.email",
                        "winner of this game.",
                        "Congratulations, You are the winner of this game"
                    );
                    res.send({ message: "game wins", data: req.roundResult });
                } else if (req.user.attempts === 5) {
                    res.send({ message: "game ends", data: req.roundResult });
                } else {
                    res.send({
                        message: "game resumes",
                        data: req.roundResult,
                    });
                }
            } else {
                res.send({ message: "game ends", data: req.roundResult });
            }
        } catch (e) {
            logger.error("[Game Today Api Erro] [POST]", e);
        }
    }
);

router.post("/new/words", authMiddleware.JWTChecker, async function (req, res) {
    logger.info("[Game New Word Api] Request Received");
    let message = "";
    if (typeof req.body.word === "string" && req.body.word.length === 5) {
        let word = await model.words.findOne({ word: req.body.word });
        if (word) {
            message = "Entry for this word exists";
        } else {
            await model.words.create({ word: req.body.word });
            message = "Successfully created a new word";
        }
    } else {
        message = "Please give a valid word";
    }
    res.send({ message });
});

module.exports = router;
