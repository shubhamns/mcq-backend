const { boolean, string } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: true
    },
    ageGroup: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    noOfQuestions: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
    // access: {
    //     type: String,
    //     required: true
    // },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    subId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "subject"
    },
    ageId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "ageGroup"
    }
});
const Topic = mongoose.model('Topic', topicSchema);
module.exports = Topic;
