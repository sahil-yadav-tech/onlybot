const mongoose = require("mongoose");

const errorSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    accountAddress:{
        type: String,
        required: true
    },
    errorAction: {
        type: String,
        default: "Less price please check matic and amount" // Default error message
    },
    status: {
        type: String,
        enum: ["unread", "seen"], // Enum values should be strings
        default: "unread" // Default status is "unread"
    },
});

const ErrorModel = mongoose.model("ErrorModel", errorSchema); // Use PascalCase for model name
module.exports = ErrorModel;
