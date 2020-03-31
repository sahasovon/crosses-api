const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    boxNumber: {
        type: Number,
        default: 3
    },
    startedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    boxData: {
        type: Array,
        required: true
    },
    filledData: {
        type: Number,
        default: 0
    },
    players: {
        first: {
            type: String,
            required: 'Player side is required'
        },
        second: {
            type: String,
            required: 'Player side is required'
        }
    },
    winner: String,
    nextTurnBy: {
        type: String,
        enum: ['first', 'second'],
        required: true
    },
    result: {
        type: String,
        enum: ['ongoing', 'first', 'second', 'draw'],
        default: 'ongoing'
    },
    resultBoxes: {
        type: Array
    },
    activities: [String]
}, {timestamps: true});

module.exports = mongoose.model('Game', GameSchema);
