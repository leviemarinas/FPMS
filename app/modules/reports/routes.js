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
function assign(req,res,next){
    db.query(`SELECT * FROM tblrep where strRTPeriodicalID = "${req.params.strPeriodicalID}"`,(err,results,field)=>{
        req.assign = results;
        return next();
    });
}
function renderReportPage(req,res){
    res.locals.Name = 
    res.render('reports/views/Breport',{periods : req.periods, reports : req.reports, assigns: req.assign});
}
router.get('/',(req,res)=>{
    db.query(`SELECT * FROM tblperiodical`,(err,results,field)=>{
        return res.render('reports/views/report',{periods : results});
    });
});

router.get('/:strPeriodicalID', periods,report,assign,renderReportPage)

function reps(req,res,next){
    db.query(`SELECT * FROM tblreporttype`,(err,results,field)=>{
        req.reps = results;
        return next();
    });
}
function profs(req,res,next){
    db.query(`SELECT * FROM tblfacultyprofile WHERE is_Deleted = "0"`,(err,results,field)=>{
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


function submit(req,res,next){
    db.query(`SELECT * FROM tblrep WHERE strRepSubmitFacultyID = "${req.params.strFacultyID}" AND datDateSubmitted is null`,(err,results,field)=>{
        req.submit = results;
        return next();
    });
}

router.get('/Rep/Submit',profs,(req,res)=>{
    res.locals.PASS = 1;
    res.render('reports/views/ReportSubmit',{profs : req.profs});
}); 

router.get('/Rep/Submit/:strFacultyID',profs,submit,(req,res)=>{
    res.locals.PASS = 0;
    res.render('reports/views/ReportSubmit',{submits : req.submit,profs:req.profs});   
});

router.put('/Rep/Submit/:strFacultyID',(req,res)=>{
    db.query(`UPDATE tblrepsubmit SET 
    datDateSubmitted = "${req.body.datesubmitted}"
    WHERE strRepSubmitID = "${req.body.report}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/reports');
    });
});




exports.reports = router;