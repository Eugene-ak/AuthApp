const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    }, 
    picture: {
        type: String
    },
    addedBy: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    }
},{
    timestamps: true
});

module.exports = mongoose.model("news", newsSchema);