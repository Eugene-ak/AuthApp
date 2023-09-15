const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    token: {
        type: String
    },
    revoked: {
        type: Boolean,
        default: false
    },
    jti: {
        type: String
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("token", tokenSchema);
