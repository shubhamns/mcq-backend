const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mcqsSchema = new mongoose.Schema({
    mcqs: {
        type: String,
        required: true
    },
    option1: {
        type: String,
        required: true
    },
    option2: {
        type: String,
        required: true
    },
    option3: {
        type: String,
        required: true
    },
    option4: {
        type: String,
        required: true
    },
    image: {
        type: [],
        require: false
    },
    answer: {
        type: String,
        required: true
    },
    posFeedback: {
        type: String,
        required: true
    },
    negFeedback: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user"
    },
    topicId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "topic"
    },

    //    typeId:{
    //     type: Schema.Types.ObjectId,
    //     required: true,
    //     ref: "type"
    //    }
});

const Mcqs = mongoose.model('MCQS', mcqsSchema);
module.exports = Mcqs;
