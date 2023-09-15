const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String,
            select: false
        },
        dateOfBirth: {
            type: String
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        profilePicture: {
            url: {
                type: String
            },
            fileName: {
                type: String
            }
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        }
    },
    {
        timestamps: true
    }
);

userSchema.post("save", (error, next) => {
    if(error.code === 11000) {
        const [ field ] = Object.keys(error.keyValue);
        const value = error.keyValue[ field ];
        next(new Error(`User already exits with ${field} called ${value}`));
    }
    else {
        next();
    }
});

module.exports = mongoose.model("users", userSchema);