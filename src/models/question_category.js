const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionTypeSchema = new mongoose.Schema({
    questionType: {
        type: String,
        required: true
    }
    // userId: {
    //     type: Schema.Types.ObjectId,
    //     required: true,
    //     ref: "user"
    // }
});
const QuestionType = mongoose.model('Type', questionTypeSchema);
module.exports = QuestionType;
