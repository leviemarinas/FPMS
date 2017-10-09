var router = require('express').Router();
var db = require('../../lib/database')();
var authMiddleware = require('../auth/middlewares/auth');



router.get('/IT',authMiddleware.hasAuth, (req,res) =>{          
    res.render('schedule/views/DITSched');
});
router.get('/CS',authMiddleware.hasAuth, (req,res) =>{          
    res.render('schedule/views/DCSSched');
});

exports.schedule = router;