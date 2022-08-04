module.exports = {
    get reset_time() {
        let date = new Date();
        return new Date(
            `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} 24:00:00`
        );
    },
    mongoConnection: "mongodb://mongo:27017/geospoc", //"mongodb://mongo:27017/geospoc", //'mongodb://127.0.0.1/geospoc',
    jwt_secret: "sdfghkjulkdyyyxcbvnbmsfdgfhgjhkjtrtyufghqewrertcvnxvcb",
    mail: {
        gmail: {
            client_id:
                "795487134927-cvts59naold5i5i5gnfvu4kccg8l2esn.apps.googleusercontent.com",
            client_secret: "17ozEY9LX7HkngEaqOVSgwot",
            redirct_uri: "https://developers.google.com/oauthplayground",
            refresh_token:
                "1//04YeOgRVGxOeoCgYIARAAGAQSNgF-L9Ir3HlhoKPZjvlzswYKXCLcsJ_onAmMQfoXOkX9FA-iNiQLQ90P4ajnc91f27sD3X6z4Q",
        },
    },
    today_word: "agree",
    captcha: {
        secretKey: "6LfC3UIhAAAAAEHK1NHyYp9D-N944W_JDML1Q2EF",
        url: "https://www.google.com/recaptcha/api/siteverify?secret=",
    },
    logging: {
        maxfiles: "360d",
        logger_dir: "/logs",
    },
};
