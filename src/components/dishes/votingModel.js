import mongoose from "mongoose";

const votingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    star: {
        type: Number,
        required: true
    },
    dish: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Voting = mongoose.Model("Voting", votingSchema);

export default Voting;