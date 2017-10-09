var router = require('express').Router();
var db = require('../../lib/database')();
var authMiddleware = require('../auth/middlewares/auth');
var counter = require('../auth/middlewares/SC');


function periods(req, res, next){
    db.query(`SELECT * FROM tblperiodical`,(err,results,field)=>{
        req.periods = results;
        return next();  
    });
}
function report(req, res, next){
    db.query(`SELECT * FROM tblreporttype where strReportTypePeriodicalID = "${req.params.strPeriodicalID}"`,(err,results,field)=>{
        req.reports = results;
        return next();
    });
}
function renderReportPage(req,res){
    res.render('reports/views/Breport',{periods : req.periods, reports : req.reports});
}
router.get('/',(req,res)=>{
    db.query(`SELECT * FROM tblperiodical`,(err,results,field)=>{
        return res.render('reports/views/report',{periods : results});
    });
});

router.get('/:strPeriodicalID', periods,report,renderReportPage)

function reps(req,res,next){
    db.query(`SELECT * FROM tblreporttype`,(err,results,field)=>{
        req.reps = results;
        return next();
    });
}
function profs(req,res,next){
    db.query(`SELECT * FROM tblfacultyprofile`,(err,results,field)=>{
        req.profs = results;
        return next();
    });
}
function ID(req,res,next){
    db.query(`SELECT MAX(strRepSubmitID) as strRepSubmitID FROM tblrepsubmit`,(err,results,field)=>{
        res.locals.ID = results[0].strRepSubmitID;
        return next()
    });
}
function renderReportAssign(req,res){
    res.render('reports/views/ReportSelect',{reps : req.reps , profs : req.profs});
}

router.get('/Rep/Assign',reps,profs,ID,renderReportAssign)

router.post('/Rep/Assign',(req,res)=>{
    var faculty;
    var newID,rotID;
    faculty = req.body.faculty;
    newID = counter.smart(req.body.rsid);
    for(var x=0;x<faculty.length;x++){
        db.query(`INSERT INTO tblrepsubmit (strRepSubmitID,strRepSubmitRTID,strRepSubmitFacultyID,datRepDeadline) 
        VALUES ("${newID}","${req.body.type}","${faculty[x]}","${req.body.deadline}")`,(er,res,fld)=>{
            if(er) throw er;
        });
        newID=counter.smart(newID);
    }
    res.redirect('/reports');
});


exports.reports = router;