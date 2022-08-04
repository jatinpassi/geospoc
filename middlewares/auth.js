const JWT = require("jsonwebtoken");
const config = require("../config");
const model = require("../schemas");

module.exports.JWTChecker = async function (req, res, next) {
    try {
        let parsedToken = await JWT.verify(
            req.headers["authorization"].slice(6),
            config.jwt_secret
        );
        if (parsedToken) {
            let user = await model.user.findOne({
                email: parsedToken.email,
                jwt: req.headers["authorization"].slice(6),
            });
            if (user) {
                req.user = user;
                next();
            } else {
                res.status(200).send({ message: "Invalid Token" });
            }
        } else {
            res.status(200).send({ message: "Invalid Token" });
        }
    } catch (e) {
        res.status(200).send({ message: "Invalid Token" });
    }
};
