const mongoose = require("mongoose");

const setTimeSchema = new mongoose.Schema({
    firstTime: {
        type: Number,
        required: true
    },
    lastTime: {
        type: Number,
        required: true
    },
    dollarStart: {
        type: Number,
        required: true
    },
    dollarEnd: {
        type: Number,
        required: true
    },
    decimalPlaces:{
        type: Number,
        required: true
    }
});

const SetTime = mongoose.model("SetTime", setTimeSchema);

module.exports = SetTime;
