let db = require("../db/word");

module.exports.gameLogic = async function (req, res, next) {
    let comparableWord = db[new Date().getMonth()].toLowerCase();
    let respArr = req.body.word
        .toLowerCase()
        .split("")
        .map((char, index) => {
            if (comparableWord.indexOf(char) === index) {
                return "correct";
            } else if (comparableWord.indexOf(char) !== -1) {
                let regex = new RegExp(char, "g"),
                    result,
                    comparableCharArr = [],
                    wordCharArr = [];
                while ((result = regex.exec(comparableWord))) {
                    comparableCharArr.push(result.index);
                }
                while ((result = regex.exec(req.body.word))) {
                    wordCharArr.push(result.index);
                }

                if (comparableCharArr.length >= wordCharArr.length) {
                    return "improve";
                } else {
                    if (
                        wordCharArr
                            .slice(
                                0,
                                comparableCharArr.filter((ele) => {
                                    return wordCharArr.indexOf(ele) === -1;
                                }).length
                            )
                            .indexOf(index) !== -1
                    ) {
                        return "improve";
                    } else {
                        return "wrong";
                    }
                }
            }
            return "wrong";
        });
    req.roundResult = respArr;
    next();
};
