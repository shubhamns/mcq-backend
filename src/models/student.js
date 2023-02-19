const Joi = require('joi');
const mongoose = require('mongoose');

const Student = mongoose.model('Student', new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
}));

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(5).max(255).required(),
    }) ;
    return schema.validate( user);
}
exports.Student = Student;
exports.validate = validateUser;
