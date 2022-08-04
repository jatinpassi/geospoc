const mongoose = require("./connection");
const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        jwt: {
            type: String,
            unique: true,
        },
        attempts: {
            type: Number,
            default: 0,
        },
        word_list: [
            {
                type: String,
            },
        ],
        score: {
            type: Number,
        },
        guess_list: [[{ type: String }]],
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        collection: "user",
    }
);

module.exports = mongoose.model("user", UserSchema);
