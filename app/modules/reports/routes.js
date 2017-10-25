var router = require('express').Router();
var functionRouter = require('express').Router();
var db = require('../../lib/database')();
var authMiddleware = require('../auth/middlewares/auth');
var counter = require('../auth/middlewares/SC');
var multer  = require('multer')
var upload = multer({ dest: 'public/assets/files/' })


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
        if(results[0]==null) res.redirect('/reports');
        req.assign = results;
        return next();
    });
}
function renderReportPage(req,res){
    res.locals.Name =
    res.render('reports/views/Breport',{periods : req.periods, reports : req.reports, assigns: req.assign});
}
router.get('/',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblperiodical`,(err,results,field)=>{
        return res.render('reports/views/report',{periods : results});
    });
});

router.get('/:strPeriodicalID',authMiddleware.hasAuth, periods,report,assign,renderReportPage)

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

router.get('/Rep/Assign',authMiddleware.hasAuth,reps,profs,ID,renderReportAssign)

router.post('/Rep/Assign',(req,res)=>{
    var faculty;
    var newID;
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

router.get('/Rep/Submit',authMiddleware.hasAuth,profs,(req,res)=>{
    res.locals.PASS = 1;
    res.render('reports/views/ReportSubmit',{profs : req.profs});
}); 

router.get('/Rep/Submit/:strFacultyID',authMiddleware.hasAuth,profs,submit,(req,res)=>{
    db.query(`SELECT * FROM tblfacultyprofile where strFacultyID = "${req.params.strFacultyID}"`,(err,results,field)=>{
        res.locals.PASS = 0;
        return res.render('reports/views/ReportSubmit',{submits : req.submit,profs:req.profs,proff:results[0]});   
    });
});

router.put('/Rep/Submit/:strFacultyID',(req,res)=>{
    db.query(`UPDATE tblrepsubmit SET 
    datDateSubmitted = "${req.body.datesubmitted}"
    WHERE strRepSubmitID = "${req.body.report}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/reports');
    });
});


function ref(req,res,next){
    db.query(`SELECT * FROM tblfunctionsref`,(err,results,field)=>{
        req.refs = results;
        return next();
    });
}
function level(req,res,next){
    db.query(`SELECT * FROM tblfunctlevel`,(err,results,field)=>{
        req.levels = results;
        return next();
    });
}




functionRouter.get('/',authMiddleware.hasAuth,profs,(req,res)=>{
    res.render('reports/views/function',{profs : req.profs})
});

functionRouter.get('/:strFacultyID',authMiddleware.hasAuth,profs,(req,res)=>{
    db.query(`SELECT * from tblfunc where strFacultyID = "${req.params.strFacultyID}"`,(err,results,field)=>{
        if(results[0]==null) res.redirect('/functions')
        res.locals.name=results[0].strFacultyName;
        return res.render('reports/views/functionlist',{profs : req.profs, funcs : results})
    });
});
functionRouter.get('/func/Assign',authMiddleware.hasAuth,profs,ref,level,(req,res)=>{
    db.query(`SELECT max(strFunctionsID) as strFunctionsID from tblfunctions`,(err,results,field)=>{
        res.locals.ID = results[0].strFunctionsID;
        return res.render('reports/views/functionsassign',{refs : req.refs, levels : req.levels, profs : req.profs})
    });
});
functionRouter.post('/func/Assign',(req,res)=>{
    var newID;
    newID = counter.smart(req.body.ftid);
    for(var x=0;x<req.body.faculty.length;x++){
        db.query(`INSERT INTO tblfunctions (strFunctionsID,strFuncLevelID,datFunctionDate,strFunctionsFRID,strFunctionsFID,strFunctionsName,strFunctionsSponsor) 
        VALUES("${newID}","${req.body.level}","${req.body.date}","${req.body.type}","${req.body.faculty[x]}","${req.body.name}","${req.body.sponsor}")`,(err,results,field)=>{
            if(err) throw err;
        });
        newID=counter.smart(newID);
    }
    res.redirect('/functions');
});





exports.reports = router;
exports.functions = functionRouter;