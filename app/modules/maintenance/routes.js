var router = require('express').Router();
var db = require('../../lib/database')();
var authMiddleware = require('../auth/middlewares/auth');
var counter = require('../auth/middlewares/SC');

router.get('/',authMiddleware.hasAuth,(req,res)=>{
    res.render('maintenance/views/mainte');
});


router.get('/Admin',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tbladmin`,(err,results,field)=>{
        return res.render('maintenance/views/pages/MainteAdmin',{admins : results});
    });
});
router.get('/Admin/new',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblfacultyprofile left join tbladmin on strFacultyID = stradminFID where stradminFID is null`,(err,results,field)=>{
        return res.render('maintenance/views/forms/MainteformAdmin',{faculties : results});
    });
});
router.post('/Admin/new',(req,res)=>{
    if(req.body.adminpassword != req.body.adminconfirmpassword){
        return res.redirect('/maintenance/Admin/new?password');
    }
    db.query(`INSERT INTO tbladmin (strUsername,strPassword,stradminFID) 
    VALUES ("${req.body.adminusername}","${req.body.adminconfirmpassword}","${req.body.faculty}")`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/Admin');
    });
});
function PD(req,res,next){
    db.query(`SELECT * FROM tblfacultyprofile`,(err,results,field)=>{
        req.faculty = results;
        return next();
    });
}
router.get('/Admin/:strUsername',authMiddleware.hasAuth,PD,(req,res)=>{
    db.query(`SELECT * FROM tbladmin where strUsername = "${req.params.strUsername}"`,(err,results,field)=>{
        if(err) throw err;
        if(results[0]==null) res.redirect('/maintenance/Admin');
        return res.render('maintenance/views/forms/MainteformAdmin',{admin : results[0],faculties : req.faculty});
    });
});
router.put('/Admin/:strUsername',(req,res)=>{
    db.query(`UPDATE tbladmin SET 
    strUsername = "${req.body.adminusername}",
    strPassword = "${req.body.adminpassword}",
    stradminFID = "${req.body.faculty}"
    WHERE strUsername = "${req.params.strUsername}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/Admin');
    });
});
router.get('/Admin/:strUsername/remove',(req,res)=>{
    db.query(`DELETE FROM tbladmin WHERE strUsername = "${req.params.strUsername}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/Admin');
    });
});

//CITIZENSHIP-CITIZENSHIP-CITIZENSHIP-CITIZENSHIP-CITIZENSHIP-CITIZENSHIP-CITIZENSHIP-CITIZENSHIP-CITIZENSHIP-CITIZENSHIP-CITIZENSHIP-CITIZENSHIP
router.get('/Citizenship',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblcitizenship`,(err,results,field)=>{
        return res.render('maintenance/views/pages/MainteCitizenship',{citizens : results});
    });
});
router.get('/Citizenship/new',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT max(strCitizenshipID) AS strCitizenshipID FROM tblcitizenship`,(err,results,field)=>{
        res.locals.ID = results[0].strCitizenshipID; 
        return res.render('maintenance/views/forms/MainteformCitizen');
    });
});
router.post('/Citizenship/new',(req,res)=>{
    var newID = counter.smart(req.body.ctid);
    db.query(`INSERT INTO tblcitizenship (strCitizenshipID,strCitizenshipName) VALUES ("${newID}","${req.body.ctname}");`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/Citizenship');
    })
});
router.get('/Citizenship/:strCitizenshipID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblcitizenship where strCitizenshipID =  "${req.params.strCitizenshipID}"`,(err,results,field)=>{
        if(err) throw err;
        if(results[0]==null) res.redirect('/maintenance/Citizenship');
        res.render('maintenance/views/forms/MainteformCitizen',{citizenship : results[0] });
    })
});
router.put('/Citizenship/:strCitizenshipID',(req,res)=>{
    db.query(`UPDATE tblcitizenship SET 
    strCitizenshipName = "${req.body.ctname}" 
    WHERE strCitizenshipID = "${req.params.strCitizenshipID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/Citizenship');
    });
});
router.get('/Citizenship/:strCitizenshipID/remove',(req,res)=>{
    db.query(`DELETE FROM tblcitizenship WHERE strCitizenshipID = "${req.params.strCitizenshipID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/Citizenship');
    });
});

//CIVILSTATUS-CIVILSTATUS-CIVILSTATUS-CIVILSTATUS-CIVILSTATUS-CIVILSTATUS-CIVILSTATUS-CIVILSTATUS-CIVILSTATUS-CIVILSTATUS-CIVILSTATUS-CIVILSTATUS

router.get('/CivilStatus',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblcivilstatus`,(err,results,field)=>{
        return res.render('maintenance/views/pages/MainteCivilStatus',{civils : results});
    });
});
router.get('/CivilStatus/new',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT max(strCivilStatusID) AS strCivilStatusID FROM tblCivilStatus`,(err,results,field)=>{
        res.locals.ID = results[0].strCivilStatusID; 
        return res.render('maintenance/views/forms/MainteformCivilStatus');
    });
});
router.post('/CivilStatus/new',(req,res)=>{
    var newID = counter.smart(req.body.csid);
    db.query(`INSERT INTO tblCivilStatus (strCivilStatusID,strCivilStatusName) VALUES ("${newID}","${req.body.csname}");`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/CivilStatus');
    })
});
router.get('/CivilStatus/:strCivilStatusID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblCivilStatus where strCivilStatusID =  "${req.params.strCivilStatusID}"`,(err,results,field)=>{
        if(err) throw err;
        if(results[0]==null) res.redirect('/maintenance/CivilStatus');
        res.render('maintenance/views/forms/MainteformCivilStatus',{CivilStatus : results[0] });
    })
});
router.put('/CivilStatus/:strCivilStatusID',(req,res)=>{
    db.query(`UPDATE tblCivilStatus SET 
    strCivilStatusName = "${req.body.csname}" 
    WHERE strCivilStatusID = "${req.params.strCivilStatusID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/CivilStatus');
    });
});
router.get('/CivilStatus/:strCivilStatusID/remove',(req,res)=>{
    db.query(`DELETE FROM tblCivilStatus WHERE strCivilStatusID = "${req.params.strCivilStatusID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/CivilStatus');
    });
});

//EDUCLEVEL-EDUCLEVEL-EDUCLEVEL-EDUCLEVEL-EDUCLEVEL-EDUCLEVEL-EDUCLEVEL-EDUCLEVEL-EDUCLEVEL-EDUCLEVEL-EDUCLEVEL-EDUCLEVEL-EDUCLEVEL-EDUCLEVEL-EDUCLEVEL

router.get('/EducLevel',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tbleduclevel`,(err,results,field)=>{
        return res.render('maintenance/views/pages/MainteEducationalLevel',{educs : results});
    });
});
router.get('/EducLevel/new',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT max(strEducLevelID) AS strEducLevelID FROM tblEducLevel`,(err,results,field)=>{
        res.locals.ID = results[0].strEducLevelID; 
        return res.render('maintenance/views/forms/MainteformEducationalLevel');
    });
});
router.post('/EducLevel/new',(req,res)=>{
    var newID = counter.smart(req.body.elid);
    db.query(`INSERT INTO tblEducLevel (strEducLevelID,strEducLevelName) VALUES ("${newID}","${req.body.elname}");`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/EducLevel');
    })
});
router.get('/EducLevel/:strEducLevelID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblEducLevel where strEducLevelID =  "${req.params.strEducLevelID}"`,(err,results,field)=>{
        if(err) throw err;
        if(results[0]==null) res.redirect('/maintenance/EducLevel');
        res.render('maintenance/views/forms/MainteformEducationalLevel',{EducLevel : results[0] });
    })
});
router.put('/EducLevel/:strEducLevelID',(req,res)=>{
    db.query(`UPDATE tblEducLevel SET 
    strEducLevelName = "${req.body.elname}" 
    WHERE strEducLevelID = "${req.params.strEducLevelID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/EducLevel');
    });
});
router.get('/EducLevel/:strEducLevelID/remove',(req,res)=>{
    db.query(`DELETE FROM tblEducLevel WHERE strEducLevelID = "${req.params.strEducLevelID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/EducLevel');
    });
});

//EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE-EMPTYPE

router.get('/EmployeeType',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblemployeetype`,(err,results,field)=>{
        return res.render('maintenance/views/pages/MainteEmployeeType',{emps : results});
    });
});
router.get('/EmployeeType/new',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT max(strEmployeeTypeID) AS strEmployeeTypeID FROM tblEmployeeType`,(err,results,field)=>{
        res.locals.ID = results[0].strEmployeeTypeID; 
        return res.render('maintenance/views/forms/MainteformEmployeeType');
    });
});
router.post('/EmployeeType/new',(req,res)=>{
    var newID = counter.smart(req.body.etid);
    db.query(`INSERT INTO tblEmployeeType (strEmployeeTypeID,strEmployeeTypeName) VALUES ("${newID}","${req.body.etname}");`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/EmployeeType');
    })
});
router.get('/EmployeeType/:strEmployeeTypeID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblEmployeeType where strEmployeeTypeID =  "${req.params.strEmployeeTypeID}"`,(err,results,field)=>{
        if(err) throw err;
        if(results[0]==null) res.redirect('/maintenance/EmployeeType');
        res.render('maintenance/views/forms/MainteformEmployeeType',{EmployeeType : results[0] });
    })
});
router.put('/EmployeeType/:strEmployeeTypeID',(req,res)=>{
    db.query(`UPDATE tblEmployeeType SET 
    strEmployeeTypeName = "${req.body.etname}" 
    WHERE strEmployeeTypeID = "${req.params.strEmployeeTypeID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/EmployeeType');
    });
});
router.get('/EmployeeType/:strEmployeeTypeID/remove',(req,res)=>{
    db.query(`DELETE FROM tblEmployeeType WHERE strEmployeeTypeID = "${req.params.strEmployeeTypeID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/EmployeeType');
    });
});

//FACULTYRANK-FACULTYRANK-FACULTYRANK-FACULTYRANK-FACULTYRANK-FACULTYRANK-FACULTYRANK-FACULTYRANK-FACULTYRANK-FACULTYRANK-FACULTYRANK-FACULTYRANK-FACULTYRANK

router.get('/FacultyRank',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblfacultyrankref`,(err,results,field)=>{
        return res.render('maintenance/views/pages/MainteFacultyRank',{ranks : results});
    });
});
router.get('/FacultyRank/new',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT max(strFacultyRankRefID) AS strFacultyRankRefID FROM tblfacultyrankref`,(err,results,field)=>{
        res.locals.ID = results[0].strFacultyRankRefID; 
        return res.render('maintenance/views/forms/MainteformFacultyRank');
    });
});
router.post('/FacultyRank/new',(req,res)=>{
    var newID = counter.smart(req.body.frid);
    db.query(`INSERT INTO tblfacultyrankref (strFacultyRankRefID,strFacultyRankName) VALUES ("${newID}","${req.body.frname}");`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/FacultyRank');
    })
});
router.get('/FacultyRank/:strFacultyRankRefID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblfacultyrankref where strFacultyRankRefID =  "${req.params.strFacultyRankRefID}"`,(err,results,field)=>{
        if(err) throw err;
        if(results[0]==null) res.redirect('/maintenance/FacultyRank');
        res.render('maintenance/views/forms/MainteformFacultyRank',{FacultyRank : results[0] });
    })
});
router.put('/FacultyRank/:strFacultyRankRefID',(req,res)=>{
    db.query(`UPDATE tblfacultyrankref SET 
    strFacultyRankName = "${req.body.frname}" 
    WHERE strFacultyRankRefID = "${req.params.strFacultyRankRefID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/FacultyRank');
    });
});
router.get('/FacultyRank/:strFacultyRankRefID/remove',(req,res)=>{
    db.query(`DELETE FROM tblfacultyrankref WHERE strFacultyRankRefID = "${req.params.strFacultyRankRefID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/FacultyRank');
    });
});

//FUNCTIONLEVEL-FUNCTIONLEVEL-FUNCTIONLEVEL-FUNCTIONLEVEL-FUNCTIONLEVEL-FUNCTIONLEVEL-FUNCTIONLEVEL-FUNCTIONLEVEL-FUNCTIONLEVEL-FUNCTIONLEVEL-FUNCTIONLEVEL

router.get('/FunctionLevel',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblfunctlevel`,(err,results,field)=>{
        return res.render('maintenance/views/pages/MainteFunctionLevel',{levels : results});
    });
});
router.get('/FunctionLevel/new',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT max(strFunctLevelID) AS strFunctLevelID FROM tblfunctlevel`,(err,results,field)=>{
        res.locals.ID = results[0].strFunctLevelID; 
        return res.render('maintenance/views/forms/MainteformFunctionLevel');
    });
});
router.post('/FunctionLevel/new',(req,res)=>{
    var newID = counter.smart(req.body.flid);
    db.query(`INSERT INTO tblfunctlevel (strFunctLevelID,strFunctLevelName) VALUES ("${newID}","${req.body.flname}");`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/FunctionLevel');
    })
});
router.get('/FunctionLevel/:strFunctLevelID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblfunctlevel where strFunctLevelID =  "${req.params.strFunctLevelID}"`,(err,results,field)=>{
        if(err) throw err;
        if(results[0]==null) res.redirect('/maintenance/FunctionLevel');
        res.render('maintenance/views/forms/MainteformFunctionLevel',{FunctLevel : results[0] });
    })
});
router.put('/FunctionLevel/:strFunctLevelID',(req,res)=>{
    db.query(`UPDATE tblfunctlevel SET 
    strFunctLevelName = "${req.body.flname}" 
    WHERE strFunctLevelID = "${req.params.strFunctLevelID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/FunctionLevel');
    });
});
router.get('/FunctionLevel/:strFunctLevelID/remove',(req,res)=>{
    db.query(`DELETE FROM tblfunctlevel WHERE strFunctLevelID = "${req.params.strFunctLevelID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/FunctionLevel');
    });
});

//FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS-FUNCTIONS

router.get('/Functions',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblfunctionsref`,(err,results,field)=>{
        return res.render('maintenance/views/pages/MainteFunctionsAttended',{ftypes : results});
    });
});
router.get('/Functions/new',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT max(strFuncRefID) AS strFuncRefID FROM tblfunctionsref`,(err,results,field)=>{
        res.locals.ID = results[0].strFuncRefID; 
        return res.render('maintenance/views/forms/MainteformFunctionType');
    });
});
router.post('/Functions/new',(req,res)=>{
    var newID = counter.smart(req.body.ftid);
    db.query(`INSERT INTO tblfunctionsref (strFuncRefID,strFuncRefName) VALUES ("${newID}","${req.body.ftname}");`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/Functions');
    })
});
router.get('/Functions/:strFuncRefID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblfunctionsref where strFuncRefID =  "${req.params.strFuncRefID}"`,(err,results,field)=>{
        if(err) throw err;
        if(results[0]==null) res.redirect('/maintenance/Functions');
        res.render('maintenance/views/forms/MainteformFunctionType',{FunctionType : results[0] });
    })
});
router.put('/Functions/:strFuncRefID',(req,res)=>{
    db.query(`UPDATE tblfunctionsref SET 
    strFuncRefName = "${req.body.ftname}" 
    WHERE strFuncRefID = "${req.params.strFuncRefID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/Functions');
    });
});
router.get('/Functions/:strFuncRefID/remove',(req,res)=>{
    db.query(`DELETE FROM tblfunctionsref WHERE strFuncRefID = "${req.params.strFuncRefID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/Functions');
    });
});

//PERIODICAL-PERIODICAL-PERIODICAL-PERIODICAL-PERIODICAL-PERIODICAL-PERIODICAL-PERIODICAL-PERIODICAL-PERIODICAL-PERIODICAL-PERIODICAL-PERIODICAL-PERIODICAL-PERIODICAL-PERIODICAL

router.get('/Periodical',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblperiodical`,(err,results,field)=>{
        return res.render('maintenance/views/pages/MaintePeriodicalReport',{periods : results});
    });
});
router.get('/Periodical/new',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT max(strPeriodicalID) AS strPeriodicalID FROM tblPeriodical`,(err,results,field)=>{
        res.locals.ID = results[0].strPeriodicalID; 
        return res.render('maintenance/views/forms/MainteformPeriodical');
    });
});
router.post('/Periodical/new',(req,res)=>{
    var newID = counter.smart(req.body.pid);
    db.query(`INSERT INTO tblPeriodical (strPeriodicalID,strPeriodicalName) VALUES ("${newID}","${req.body.pname}");`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect('/maintenance/Periodical');
    })
});
router.get('/Periodical/:strPeriodicalID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblPeriodical where strPeriodicalID =  "${req.params.strPeriodicalID}"`,(err,results,field)=>{
        if(err) throw err;
        if(results[0]==null) res.redirect('/maintenance/Periodical');
        res.render('maintenance/views/forms/MainteformPeriodical',{Periodical : results[0] });
    })
});
router.put('/Periodical/:strPeriodicalID',(req,res)=>{
    db.query(`UPDATE tblPeriodical SET 
    strPeriodicalName = "${req.body.pname}" 
    WHERE strPeriodicalID = "${req.params.strPeriodicalID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/Periodical');
    });
});
router.get('/Periodical/:strPeriodicalID/remove',(req,res)=>{
    db.query(`DELETE FROM tblPeriodical WHERE strPeriodicalID = "${req.params.strPeriodicalID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/maintenance/Periodical');
    });
});

exports.maintenance = router;