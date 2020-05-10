const express = require('express');
const router = express.Router();
const {Video} = require("../models/Video");

const {auth} = require("../middleware/auth");

const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.mp4') {
            return cb(res.status(400).end('only mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({storage: storage}).single("file");

//=================================
//             Video
//=================================

router.get("/getVideos", (req, res) => {

    //연관 디비 정보를 가져오려면 populate 해야함
    Video.find().populate('writer')
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({success: true, videos})
        })
});

router.post("/getVideoDetail", (req, res) => {

    Video.findOne({"_id": req.body.videoId}).populate('writer')
        .exec((err, videoDetail) => {
            if(err) return res.status(400).send(err)
            return res.status(200).json({success:true, videoDetail})
        })
});

router.post("/uploadfiles", (req, res) => {
    upload(req, res, err => {
        if (err) {
            return res.json({success: false, err})
        }
        return res.json({success: true, url: res.req.file.path, fileName: res.req.file.name})
    })

});

router.post("/uploadVideo", (req, res) => {
    //비디오 정보 저장
    const video = new Video(req.body)

    video.save((err, doc) => {
        if (err) {
            return res.json({success: false, err})
        }
        return res.status(200).json({success: true})
    });
});

router.post("/thumbnail", (req, res) => {
    //썸네일 생성, 비디오 런닝 타임 생성
    let filePath = "";
    let fileDuration = "";

    ffmpeg.ffprobe(req.body.url, function (err, metadata) {
        console.dir(metadata);
        console.log(metadata.format.duration);
        fileDuration = metadata.format.duration;
    });

    //썸네일 생성
    ffmpeg(req.body.url)
        .on('filenames', function (filenames) {
            console.log('Will generate ' + filenames.join(', '))
            console.log(filenames)

            filePath = "uploads/thumbnails/" + filenames[0];
        })
        .on('end', function () {
            console.log('Screenshots taken');
            return res.json({success: true, filePath, fileDuration: fileDuration})
        })
        .on('error', function (err) {
            console.error(err);
            return res.json({success: false, err})
        })
        .screenshots({
            // Will take screens at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x240',
            // %b input basename ( filename w/o extension )
            filename: 'thumbnail-%b.png'
        });

});
module.exports = router;
