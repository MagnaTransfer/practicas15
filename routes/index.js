var express = require('express');
var router = express.Router();
var managerController = require('../controllers/managerController.js');
var courseController = require('../controllers/courseController');
var studentController = require('../controllers/studentController.js');
var sessionController = require('../controllers/sessionController');
var userController = require('../controllers/userController');
var adminController = require('../controllers/adminController');

/* Pagina de entrada GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express',
        errors: []
    });
});

// /courses routes definition
router.param('courseId', courseController.load);
router.get('/courses/new',sessionController.loginRequired,
    sessionController.roleRequired("MANAGER","ADMIN"), courseController.new);
router.post('/courses', courseController.create);
router.get('/courses', sessionController.loginRequired, courseController.index);
router.get('/courses/:courseId(\\d+)/edit',sessionController.loginRequired,
    sessionController.roleRequired("MANAGER","ADMIN"), courseController.edit);
router.put('/courses/:courseId(\\d+)', courseController.update);
router.delete('/courses/:courseId(\\d+)', courseController.destroy);
router.get('/courses/:courseId(\\d+)',sessionController.loginRequired, courseController.show);
router.post('/courses/pick', courseController.pick);

/* students */
router.get('/students',sessionController.loginRequired,
    sessionController.roleRequired("STUDENT"), studentController.index);
router.get('/students/new',sessionController.logoutRequired, studentController.new);
router.post('/students', studentController.create);
router.delete('/students', studentController.destroy);
router.get('/students/edit', sessionController.loginRequired,
    sessionController.roleRequired("STUDENT"),studentController.edit);
router.put('/students', studentController.update);
router.get('/students/mycourses', sessionController.loginRequired,
    sessionController.roleRequired("STUDENT"), studentController.courses);


//Definicion de rutas de sesion
router.get('/login', sessionController.new); // formulario login, muestra la pagina
router.post('/login', sessionController.create); //hacer login
router.get('/logout',sessionController.loginRequired, sessionController.destroy); //hacer logout



//Definicion de rutas de manager
//router.param('id', managerController.load);
router.get('/managers',sessionController.loginRequired,
    sessionController.roleRequired("MANAGER"), managerController.index);
router.get('/managers/new',sessionController.logoutRequired ,managerController.new);
router.post('/managers', managerController.create);
router.get('/managers/edit',sessionController.loginRequired,
    sessionController.roleRequired("MANAGER","ADMIN"), managerController.edit);
router.put('/managers/', managerController.update);
router.delete('/managers/delete/', managerController.destroy);

// /admin routes definition
router.get('/admins',sessionController.loginRequired,
    sessionController.roleRequired("ADMIN"), adminController.index);
router.get('/admins/new',sessionController.logoutRequired, adminController.new);
router.post('/admins', adminController.create);

// /user routes definition
router.param('userId', userController.load);
router.get('/users', userController.index);
router.get('/users/new', function (req, res) {
    res.render('users/new', {
        errors: []
    })
});
router.delete('/users/:userId(\\d+)', userController.destroy);

router.get('/forgot', userController.forgot);
router.post('/forgot', userController.send);
router.get('/reset', userController.reset);
router.put('/reset', userController.change)

module.exports = router;
