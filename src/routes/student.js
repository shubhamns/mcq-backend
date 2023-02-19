const { Student, validate } = require('../models/student')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createStudent = async function (req, res) {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // Check if this user already exisits
    let student = await Student.findOne({ username: req.body.username });
    if (student) {
        return res.status(400).send('That user already exists!');
    } else {
        // Insert the new user if they do not exist yet
        student = new Student({
            username: req.body.username,
            password: req.body.password,
        });
        // Salt the password
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(student.password, salt)
        await student.save();
        res.send(student);
    }
};

const loginStudent = function (req, res) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    Student.findOne({ username: req.body.username }, function (err, student) {
        if (err) return res.status(500).send('Error on the serve');
        if (!student) return res.status(404).send('Student not found');

        // Compare the student password with hashed password
        const passwordIsValid = bcrypt.compareSync(req.body.password, student.password)
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null })
        const token = jwt.sign({ id: student._id }, jwtSecretKey, { expiresIn: 86400 });
        // Create jason web token for authentication
        res.status(200).send({ auth: true, token: token });
    })
}

//Routes
router.post('/login', loginStudent);
router.post('/create', createStudent);


module.exports = router;
