var express = require('express');
var router = express.Router();
var mime = require('mime');

var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.' + mime.extension(file.mimetype));
    }
});

var upload = multer({ storage: storage }).single('profileImage');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/register', function (req, res, next) {
    res.render('register', {
        title: 'Register'
    })
});

router.get('/login', function (req, res, next) {
    res.render('login', {
        title: 'Login'
    })
});

router.post('/register', function (req, res, next) {
    upload(req, res, function (err) {

        var name = req.body.name;
        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var confirm_password = req.body.confirm_password;

        //  check for image fields
        if (req.file.profieImage) {
            console.log('Uploading files .... ');

            // File info
            var originalImageOriginalName = req.files.profileImage.originalname;
            var profileImageName = req.files.profileImage.name;
            var profileImageMime = req.files.profileImage.mimetype;
            var profileImagePath = req.files.path;
            var profileImageExtension = req.files.profileImage.extension;
            var profileImageSize = req.files.profileImage.size;

        } else {
            //    Set a default image
            var profileImageName = 'noimage.png';
        }

        //  Form validation
        req.checkBody('name', 'Name field is required').notEmpty();
        req.checkBody('email', 'Email field is required').notEmpty();
        req.checkBody('email', 'Email not valid').isEmail();
        req.checkBody('username', 'Username is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('confirm_password', 'Passwords do not match').equals(req.body.password);

//    Check for errors

        var errors = req.validationErrors();
        if (errors) {

            res.render('register', {
                errors: errors,
                name: name,
                email: email,
                username: username,
                password: password,
                confirm_password: confirm_password
            })

        } else {
            // var newUser = new User({
            //     name: name,
            //     email: email,
            //     username: username,
            //     password: password,
            //     profileImage: profileImageName
            // });
            //
            // //    Create User
            // User.createUser(newUser, function (err, user) {
            //     if (err) throw err;
            //     console.log(user)
            // });

            //    Success Message
            req.flash('success', 'You\'re now registered and may log in.');
            res.location('/');
            res.redirect('/');
        }

    });

});

module.exports = router;
