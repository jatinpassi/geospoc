const express = require("express");
const router = express.Router();
const model = require("../schemas");
const JWT = require("jsonwebtoken");
const config = require("../config");
const authMiddleware = require("../middlewares/auth");
const logger = require("../helper/logger");
const axios = require("axios");

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

router.get("/isValid", authMiddleware.JWTChecker, async function (req, res) {
    let status = "";
    if (req.user.score === 10) {
        status = "game wins";
    } else if (req.user.attempts === 6 && req.user.score < 10) {
        status = "game ends";
    } else {
        status = "game resumes";
    }
    res.status(200).send({
        message: "Valid User",
        data: {
            word_list: req.user.word_list,
            guess_list: req.user.guess_list,
            game_status: status,
        },
    });
});

router.post("/login", async function (req, res) {
    try {
        logger.info("[Users Login Api] [POST] Request Received");
        if (!(req.body.name && req.body.email && req.body.capcha)) {
            res.send({ message: "Please fill required fields." });
        } else {
            const captchaUrl =
                config.captcha.url +
                encodeURIComponent(config.captcha.secretKey) +
                "&response=" +
                encodeURIComponent(req.body.capcha);
            const response = await axios.get(captchaUrl);
            if (
                response &&
                response.status === 200 &&
                response.data &&
                response.data.success
            ) {
                let user = await model.user.findOne({
                    email: req.body.email,
                });
                if (user) {
                    if (user.name === req.body.name) {
                        let token = JWT.sign(
                            {
                                email: user.email,
                                expiresIn: config.reset_time.getTime(),
                            },
                            config.jwt_secret,
                            {
                                algorithm: "HS256",
                            }
                        );
                        if (req.headers["authorization"]) {
                            let parsedToken = await JWT.verify(
                                req.headers["authorization"].slice(6),
                                config.jwt_secret
                            );
                            if (
                                parsedToken.expiresIn ===
                                    config.reset_time.getTime() &&
                                parsedToken.email === req.body.email
                            ) {
                                let user = await model.user.findOne({
                                    email: parsedToken.email,
                                });
                                res.send({
                                    message: "Login succeed",
                                    token: user.jwt,
                                });
                            } else {
                                userToken = await JWT.verify(
                                    user.jwt,
                                    config.jwt_secret
                                );
                                if (
                                    userToken.expiresIn ===
                                    config.reset_time.getTime()
                                ) {
                                    res.send({
                                        message: "Login succeed",
                                        token: user.jwt,
                                    });
                                } else {
                                    await model.user.updateOne(
                                        {
                                            name: req.body.name,
                                            email: req.body.email,
                                        },
                                        {
                                            jwt: token,
                                            attempts: 0,
                                            word_list: [],
                                            guess_list: [],
                                            score: 0,
                                        }
                                    );

                                    res.send({
                                        message: "Login succeed",
                                        token,
                                    });
                                }
                            }
                        } else {
                            let parsedToken = await JWT.verify(
                                user.jwt,
                                config.jwt_secret
                            );
                            if (
                                parsedToken.expiresIn ===
                                    config.reset_time.getTime() &&
                                parsedToken.email === req.body.email
                            ) {
                                res.send({
                                    message: "Login succeed",
                                    token: user.jwt,
                                });
                            } else {
                                await model.user.updateOne(
                                    {
                                        name: req.body.name,
                                        email: req.body.email,
                                    },
                                    {
                                        jwt: token,
                                        attempts: 0,
                                        word_list: [],
                                        guess_list: [],
                                        score: 0,
                                    }
                                );
                                res.send({
                                    message: "Login succeed",
                                    token,
                                });
                            }
                        }
                    } else {
                        res.status(200).send({
                            message: "Invalid name field",
                        });
                    }
                } else {
                    let token = JWT.sign(
                        {
                            email: req.body.email,
                            expiresIn: config.reset_time.getTime(),
                        },
                        config.jwt_secret,
                        {
                            algorithm: "HS256",
                        }
                    );
                    user = await model.user.create({
                        name: req.body.name,
                        email: req.body.email,
                        jwt: token,
                        attempts: 0,
                        word_list: [],
                        guess_list: [],
                        score: 0,
                    });
                    res.send({ message: "Login succeed", token });
                }
            }
        }
    } catch (error) {
        logger.error("[Users Login Error] [POST]", error);

        res.status(500).send({ status: false });
    }
});
module.exports = router;
