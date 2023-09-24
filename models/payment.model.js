import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "users"
    }
});

export default {
    paymentSchema
}
