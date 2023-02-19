const express = require('express');
const router = express.Router();
const True_false = require('../models/True_false');


//Create a new question
function isValidQuestionRequest(req) {
    if (!req.body.question || !req.body.answer) {
        return false;
    }
    return true;
}
function CreateTFQuestion(req, res) {

    // validate request
    if (!isValidQuestionRequest(req)) {
        return res.status(400).send({
            success: false,
            message: "Please fill out all the required feilds"
        });
    }
    // create a true false
    let true_false = new True_false(
        {
            question: req.body.question,
            answer: req.body.answer,
            userId: req.params.userId,
            topicId: req.params.topicId
        }
    );

    // save True_false in the database.
    true_false.save()
        .then(data => {
            res.send(
                // success: true,
                // message: 'Mcqs successfully created',
                data
            );
        }).catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while creating the true false."
            });
        });
};

// retrieve and return all true false.
function allTrueFalse(req, res) {
    console.log("hi")
    True_false.find()
        .then(data => {
            var message = "";
            if (data === undefined || data.length == 0) message = "No True false found!";
            else message = 'True false successfully retrieved';

            res.send({
                success: true,
                message: message,
                data: data
            });
        }).catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while retrieving True false."
            });
        });
};

// Get true false by topicId and userId
const getTrueFalseByTopic = function (req, res) {
    True_false.find({ userId: req.params.userId, topicId: req.params.topicId})
        .then(data => {
            var message = "";
            if (data === undefined || data.length == 0) message = "No true false found!";
            else message = 'true false successfully retrieved';
            res.status(200).send(data)
        }).catch(err => {
            res.status(400).send('Some error occured')
        })
}

// Delete a true false with the specified id.
function trueFalse_delete(req, res) {
    True_false.findByIdAndRemove(req.params.id)
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    success: false,
                    message: "True false not found with id " + req.params.id
                });
            }
            res.send({
                success: true,
                message: "True false successfully deleted!"
            });
        })
};
// delete a mcqs with the specified id.
// function mcqs_delete(req, res) {
//     Mcqs.findByIdAndRemove(req.params.id)
//         .then(data => {
//             if (!data) {
//                 return res.status(404).send({
//                     success: false,
//                     message: "Shop not found with id " + req.params.id
//                 });
//             }
//             res.send({
//                 success: true,
//                 message: "Shop successfully deleted!"
//             });
//         })
// };

// find a single mcqs with a id.
// function mcqs_details(req, res) {
//     console.log("hello")
//     Mcqs.findById(req.params.id)
//         .then(data => {
//             if (!data) {
//                 return res.status(404).send({
//                     success: false,
//                     message: "Mcqs not found with id " + req.params.id
//                 });
//             }
//             res.send({
//                 success: true,
//                 message: 'Mcqs successfully retrieved',
//                 data: data
//             });
//         })
// };

//Routes
router.get('/', allTrueFalse);
router.get('/get/:userId/:topicId', getTrueFalseByTopic);
router.post('/create/:userId/:topicId', CreateTFQuestion);
//router.get('/:id', mcqs_details);
// router.put('/update/:id', mcqs_update);
router.delete('/delete/:id', trueFalse_delete);
module.exports = router;