var router = require('express').Router();
var db = require('../../lib/database')();
var authMiddleware = require('../auth/middlewares/auth');
var counter = require('../auth/middlewares/SC');




router.get('/IT',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblfp where strFacultyDeptID='DEPT-0002'`,(err,results,field)=>{
        return res.render('Faculty/views/DIT',{Fprofiles : results});
    });
});
router.get('/CS',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblfp where strFacultyDeptID='DEPT-0001'`,(err,results,field)=>{
        return res.render('Faculty/views/DCS',{Fprofiles : results});
    });
});
function PS(req,res,next){
    db.query(`select * from tblcivilstatus`,(err,res,field)=>{
        req.CS = res;
        return next();
    });
}
function PD(req,res,next){
    db.query(`select * from tblcitizenship`,(err,resu,field)=>{
        req.CT = resu;
        return next();
    });
}
function PF(req,res,next){
    db.query(`select * from tbldepartment`,(err,resul,field)=>{
        req.depts = resul;
        return next();
    });
}
function PG(req,res,next){
    db.query(`select * from tblEmployeeType`,(err,result,field)=>{
        req.emp = result;
        return next();
    })
}
function renderPage(req,res){
    db.query(`SELECT MAX(strFacultyID) AS strFacultyID FROM tblfacultyprofile`,(err,results,field)=>{
        res.locals.ID = results[0].strFacultyID;
        return res.render('Faculty/views/AFpi',{CS : req.CS, CT : req.CT, depts : req.depts, emp : req.emp});
    })
}
router.get('/add/P',PS,PD,PF,PG,renderPage);


router.post('/add/P',(req,res)=>{
    var newID = counter.smart(req.body.FID);
    db.query(`INSERT INTO tblfacultyprofile VALUES("${newID}","${req.body.firstname}","${req.body.middlename}","${req.body.lastname}","${req.body.birthday}","${req.body.address}","${req.body.dept}","${req.body.citizenship}","${req.body.civilstatus}","${req.body.doh}","${req.body.mobile}","${req.body.emailadd}","${req.body.gender}","","${req.body.employee}")`
    ,(err,results,field)=>{
        if(err) throw err;
        res.redirect(`/faculty/add/EA`);
    })
});


function educ(req,res,next){
    db.query(`select * from tbleduc where strFacultyID = "${req.params.strFacultyID}"`,(err,results,field)=>{
        req.educ = results;
        return next();

    });

}
function func(req,res,next){
    db.query(`select * from tblfunc where strFacultyID = "${req.params.strFacultyID}"`,(err,results,field)=>{
        req.func = results;
        return next();

    });
}
function prof(req,res,next){
    db.query(`select * from tblperso where strFacultyID = "${req.params.strFacultyID}"`,(err,results,field)=>{
        req.prof = results
        return next();
    });
}
function renderProfile(req,res){
    res.render('Faculty/views/ITPI', {educs : req.educ, funcs : req.func, profs : req.prof})
}
router.get('/IT/:strFacultyID',authMiddleware.hasAuth,educ,func,prof,renderProfile)
router.get('/CS/:strFacultyID',authMiddleware.hasAuth,educ,func,prof,renderProfile)

exports.faculty = router;