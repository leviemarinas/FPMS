var router = require('express').Router();
var db = require('../../lib/database')();
var authMiddleware = require('../auth/middlewares/auth');
var counter = require('../auth/middlewares/SC');




router.get('/',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblfp where is_Deleted = "0"`,(err,results,field)=>{
        return res.render('Faculty/views/DIT',{Fprofiles : results});
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
router.get('/add/P',authMiddleware.hasAuth,PS,PD,PF,PG,renderPage);


router.post('/add/P',(req,res)=>{
    var newID = counter.smart(req.body.FID);
    db.query(`INSERT INTO tblfacultyprofile VALUES("${newID}","${req.body.firstname}","${req.body.middlename}","${req.body.lastname}","${req.body.birthday}","${req.body.address}","${req.body.dept}","${req.body.citizenship}","${req.body.civilstatus}","${req.body.doh}","${req.body.mobile}","${req.body.emailadd}","${req.body.gender}","","${req.body.employee}",0)`
    ,(err,results,field)=>{
        if(err) throw err;
        return res.redirect(`/faculty/add/EA/${newID}`);
    })
});

router.get('/:strFacultyID/edit',authMiddleware.hasAuth,PS,PD,PF,PG,(req,res)=>{
    db.query(`SELECT * from tblfacultyprofile where strFacultyID = "${req.params.strFacultyID}"`,(err,results,field)=>{
        if(err) throw err;
        console.log(results);
        if(results[0]==null) return res.redirect('/faculty');
        return res.render('faculty/views/AFpi',{CS : req.CS, CT : req.CT, depts : req.depts, emp : req.emp, faculty : results[0]});
    });
});
router.put('/:strFacultyID/edit',(req,res)=>{
    db.query(`UPDATE tblfacultyProfile SET 
    strFacultyFirstname = "${req.body.firstname}",strFacultyMiddlename = "${req.body.middlename}",
    strFacultySurname = "${req.body.lastname}",datFacultyBday = "${req.body.birthday}",
    strFacultyAddress = "${req.body.address}",strFacultyDeptID = "${req.body.dept}",
    strFacultyCitizenshipID = "${req.body.citizenship}",strFacultyCivilStatusID = "${req.body.civilstatus}",
    datFacultyDateHired = "${req.body.doh}",strFacultyConNum = "${req.body.mobile}",
    strFacultyEmail = "${req.body.emailadd}",enumFacultyGender = "${req.body.gender}",
    strFacultyEmpTypeID = "${req.body.employee}"
    WHERE strFacultyID = "${req.params.strFacultyID}"`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/faculty');
    })
});
router.get('/:strFacultyID/remove',(req,res)=>{
    db.query(`UPDATE tblfacultyProfile SET
    is_Deleted = "1"
    WHERE strFacultyID = "${req.params.strFacultyID}"`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/faculty');
    });
});
function level(req,res,next){
    db.query(`SELECT * from tbleduclevel where strEducLevelID != "EL-0001"and strEducLevelID != "EL-0002" and strEducLevelID != "EL-0003"`,(err,results,field)=>{
       req.level = results;
       next();
    });
}


router.get('/add/EA/:strFacultyID',authMiddleware.hasAuth,level,(req,res)=>{
    db.query(`SELECT MAX(strEducAttainID) as strEducAttainID FROM tbleducattain`,(err,results,field)=>{
        res.locals.ID = results[0].strEducAttainID;
        res.locals.FID = req.params.strFacultyID;
        return res.render('faculty/views/AFea',{levels : req.level});
    });
});
router.post('/add/EA/:strFacultyID',(req,res)=>{
    var newID = counter.smart(req.body.eaid);
    for(var x =0;x<req.body.educ.length;x++){
        if(req.body.educ[x]==''){
            console.log("here" );
            return res.redirect('/faculty');
        } 
        db.query(`INSERT INTO tbleducattain VALUES("${newID}","${req.body.educname[x]}","${req.body.educ[x]}","${req.body.educdate[x]}","${req.body.educlevel[x]}","${req.params.strFacultyID}",${req.body.units[x]})`,(err,results,field)=>{
        if(err) throw err;    
    });
    newID = counter.smart(newID);

    }
    return res.redirect('/faculty'); 
});


function levell(req,res,next){
    db.query(`SELECT * FROM tbleduclevel`,(err,results,field)=>{
        req.levels = results;
        return next();
    });
}

router.get('/:strFacultyID/Educ',prof,levell,(req,res)=>{
    db.query(`SELECT max(strEducAttainID) AS strEducAttainID FROM tbleducattain`,(err,results,field)=>{
        res.locals.ID = results[0].strEducAttainID;
        return res.render('faculty/views/AFeaf',{profs : req.prof, levels : req.levels})
    });
});
router.post('/:strFacultyID/Educ',(req,res)=>{
    var newID = counter.smart(req.body.eaid);
    db.query(`INSERT INTO tbleducattain values("${newID}","${req.body.deg}","${req.body.suc}","${req.body.dategrads}","${req.body.level}","${req.params.strFacultyID}",${req.body.gradunits})`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/faculty');
    })
});
router.get('/:strFacultyID/:strEducAttainID',prof,levell,(req,res)=>{
    db.query(`SELECT * FROM tbleduc where strEducAttainID = "${req.params.strEducAttainID}"`,(err,results,field)=>{
        return res.render('faculty/views/AFeaf',{profs : req.prof,levels : req.levels,educ : results[0]});
    });
});
router.put('/:strFacultyID/:strEducAttainID',(req,res)=>{
    db.query(`UPDATE tbleducattain SET
    strEducAttainName = "${req.body.deg}",
    strEducAttainSchoolName = "${req.body.suc}",
    strGradYear = "${req.body.dategrads}",
    strEducAttainELID = "${req.body.level}",
    intunits = ${req.body.gradunits}
    WHERE strEducAttainID = "${req.params.strEducAttainID}"`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/faculty');
    });
});








function educ(req,res,next){
    db.query(`select * from tbleduc where strFacultyID = "${req.params.strFacultyID}"`,(err,results,field)=>{
        req.educ = results;
        return next();

    });

}
function prof(req,res,next){
    db.query(`select * from tblperso where strFacultyID = "${req.params.strFacultyID}"`,(err,results,field)=>{
        req.prof = results
        return next();
    });
}
function work(req,res,next){
    db.query(`SELECT * FROM tblworkexp where strWorkExpFPID = "${req.params.strFacultyID}"`,(err,results,field)=>{
        req.work = results;
        return next();
    });
}
function ranks(req,res,next){
    db.query(`SELECT * FROM tblrank where strFacultyRankFID = "${req.params.strFacultyID}"`,(err,results,field)=>{
        req.rank = results;
        return next();
    });
}
function renderProfile(req,res){
    res.render('Faculty/views/ITPI', {educs : req.educ, profs : req.prof, works : req.work, ranks : req.rank})
}
router.get('/:strFacultyID',authMiddleware.hasAuth,educ,prof,work,ranks,renderProfile)




router.get('/:strFacultyID/WorkExp',authMiddleware.hasAuth,prof,(req,res)=>{
    db.query(`SELECT MAX(strWorkExpID) AS strWorkExpID FROM tblworkexp`,(err,results,field)=>{
        console.log(results[0].strWorkExpID);
        res.locals.workID = results[0].strWorkExpID;
        return res.render('Faculty/views/AFWorkExperience',{profs : req.prof});
    });
});
router.post('/:strFacultyID/WorkExp',(req,res)=>{
    var newID;
    newID = counter.smart(req.body.weid)
    db.query(`INSERT INTO tblworkexp VALUES ("${newID}","${req.body.workex}","${req.params.strFacultyID}","${req.body.year}")`,(err,results,field)=>{
        if(err) throw err;
        res.redirect(`/faculty`);
    });
});

function rankref(req,res,next){
    db.query(`SELECT * FROM tblfacultyrankref`,(err,results,field)=>{
        req.rank = results;
        next();
    });
}


router.get('/:strFacultyID/rank',authMiddleware.hasAuth,rankref,prof,(req,res)=>{
    db.query(`SELECT MAX(strFacultyRankID) as strFacultyRankID FROM tblfacultyrank`,(err,results,field)=>{
        res.locals.ID = results[0].strFacultyRankID;
        return res.render('Faculty/views/AFrn',{ranks : req.rank, profs : req.prof});
    });
});
router.post('/:strFacultyID/rank',(req,res)=>{
    var newID = counter.smart(req.body.frid);
    db.query(`INSERT INTO tblfacultyrank VALUES ("${newID}","${req.body.dateofeffect}","${req.params.strFacultyID}","${req.body.rank}")`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/faculty');
    });
});


exports.faculty = router;