const express = require('express');
const router = express.Router();
const Mcqs = require('../models/mcqs');
const multer = require('multer')
var fs = require('fs');
const dbConfig = require("../config/db");
const url = dbConfig.url;
const GridFSBucket = require("mongodb").GridFSBucket;
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient(url);
const { GridFsStorage } = require("multer-gridfs-storage");

// const currentTime = new Date()
// const store = multer.diskStorage({
//     destination: function (req, file, cb) {
//         let path = `uploads/mcqs/${currentTime.getUTCFullYear()}/`
//         fs.mkdir(path, { recursive: true }, function (err) {
//             if (err) return cb(err);
//             cb(null, path);
//         });
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });
// const upload = multer({ storage: store }).single('file');

const util = require("util");
var storage = new GridFsStorage({
  url: dbConfig.url + dbConfig.database,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];
    if (match.indexOf(file.mimetype) === -1) {
      const filename = file.originalname;
      return filename;
    }
    return {
      bucketName: 'mcqs',
      filename: file.originalname
    };
  }
});
var upload = multer({ storage: storage }).single("file");
// var uploadFilesMiddleware = util.promisify(uploadFiles);
// module.exports = uploadFilesMiddleware;

//Create a new question
function CreateQuestion(req, res) {
    let imagesPaths = [];
    console.log(req.file)
    if (req.files) {
        imagesPaths = req.files.map(element => {
            // return currentTime.getUTCFullYear() + "/" + element.originalname;
            return element.originalname;

        });
    }
    else {
        
        imagesPaths.push(req.file.originalname)
    }
    let mcqs = new Mcqs(
        {
            mcqs: req.body.mcqs,
            option1: req.body.option1,
            option2: req.body.option2,
            option3: req.body.option3,
            option4: req.body.option4,
            image: imagesPaths,
            posFeedback: req.body.posFeedback,
            negFeedback: req.body.negFeedback,
            answer: req.body.answer,
            userId: req.params.userId,
            topicId: req.params.topicId,
            // typeId: req.params.typeId

        }
    );

    // save mcqs in the database.
    mcqs.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while creating the mcqs."
            });
        });
};

// Get mcqs by topic
const getMcqsByTopic = function (req, res) {
    Mcqs.find({ userId: req.params.userId, topicId: req.params.topicId})
        .then(data => {
            var message = "";
            if (data === undefined || data.length == 0) message = "No mcqs found!";
            else message = 'mcqs successfully retrieved';
            res.status(200).send(data)
        }).catch(err => {
            res.status(400).send('Some error occured')
        })
}

// retrieve and return all mcqs.
function allMcqs_questions(req, res) {
    Mcqs.find()
        .then(data => {
            var message = "";
            if (data === undefined || data.length == 0) message = "No Mcqs found!";
            else message = 'Mcqs successfully retrieved';

            res.send(data);
        }).catch(err => {
            res.status(500).send({
                success: false,
                message: err.message || "Some error occurred while retrieving Mcqs."
            });
        });
};

// delete a mcqs with the specified id.
function mcqs_delete(req, res) {
    Mcqs.findByIdAndRemove(req.params.id)
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    success: false,
                    message: "Mcqs not found with id " + req.params.id
                });
            }
            res.send({
                success: true,
                message: "Mcqs successfully deleted!"
            });
        })
};

// find a single mcqs with a id.
function mcqs_details(req, res) {
    Mcqs.findById(req.params.id)
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    success: false,
                    message: "Mcqs not found with id " + req.params.id
                });
            }
            res.send(data);
        })
};

// update a Mcqs  by the id.
function mcqs_update(req, res) {
    // validate request
    if (!req.body.question || !req.body.options) {
        return res.status(400).send({
            success: false,
            message: "Please enter All details"
        });
    }

    // find Mcqs and update
    Mcqs.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, { new: true })
        .then(data => {
            if (!data) {
                return res.status(404).send({
                    success: false,
                    message: "Mcqs not found with id " + req.params.id
                });
            }
            res.send({
                success: true,
                data: data
            });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    success: false,
                    message: "Mcqs not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                success: false,
                message: "Error updating Mcqs with id " + req.params.id
            });
        });
};

function getImage(req, res) {
    try {

        let url_parts = url.parse(req.url, true);
        // console.log (url.parse(req.url) + "naila")
        let query = url_parts.query;
        const path =`uploads/mcqs/${currentTime.getUTCFullYear()}/${query.image}`;
        // console.log(query.image + "hello")

        fs.readFile(path, function (err, data) {
            if (err) throw err; // Fail if the file can't be read.
            res.writeHead(200);
            res.status(200).end(data); // Send the file data to the browser.
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getFilesByName = async (req, res) => {
    try {
      await mongoClient.connect();
      const database = mongoClient.db(dbConfig.database);
      const bucket = new GridFSBucket(database, {
        bucketName: 'mcqs',
      });
      let readStream = bucket.openDownloadStreamByName(req.params.name);
      readStream.on("error", function (err) {
        return res.status(404).send({ message: "Cannot get the Image!" });
      });
      return readStream.pipe(res);
  
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    }
  };

//Routes
router.get('/', allMcqs_questions);
// router.post('/create/:userId/:topicId/:typeId', [upload], CreateQuestion);
router.post('/create/:userId/:topicId', [upload], CreateQuestion);

// router.get('/getMcqs/:userId/:topicId/:typeId', getMcqsByTopic)
router.get('/getMcqs/:userId/:topicId', getMcqsByTopic)

router.get('/image', getImage)
router.get('/:id', mcqs_details);
router.put('/update/:id', mcqs_update);
router.delete('/delete/:id', mcqs_delete);
router.get("/files/:name", getFilesByName);

module.exports = router;