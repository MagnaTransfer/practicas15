var express = require('express');
var router = express.Router();
var managerController = require('../controllers/managerController.js');
var courseController = require('../controllers/courseController');
var studentController = require('../controllers/studentController.js');
var sessionController = require('../controllers/sessionController');
var userController = require('../controllers/userController');

/* Pagina de entrada GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express',
        errors: []
    });
});

// /courses routes definition
router.param('id', courseController.load);
router.get('/courses', courseController.new);
router.post('/courses', courseController.create);
router.get('/courses/all', courseController.show);
router.get('/courses/:id', courseController.edit);
router.put('/courses/:id', courseController.update);
router.delete('/courses/:id', courseController.destroy);
router.get('/courses/:courseId', courseController.course);
router.post('/courses/pick', courseController.pick);

/* students */
router.get('/students', studentController.index);
router.get('/students/new', studentController.new);
router.post('/students', studentController.create);
router.delete('/students', studentController.destroy);
router.get('/students/edit', studentController.edit);
router.put('/students', studentController.update);
router.get('/students/mycourses', sessionController.loginRequired, 
    sessionController.roleRequired("STUDENT"), studentController.courses);


//Definicion de rutas de sesion
router.get('/login', sessionController.new); // formulario login, muestra la pagina
router.post('/login', sessionController.create); //hacer login
router.get('/logout', sessionController.destroy); //hacer logout


//Definicion de rutas de manager
//router.param('id', managerController.load);
router.get('/managers', managerController.index);
router.get('/managers/new', managerController.new);
router.post('/managers/create', managerController.create);
router.get('/managers/edit', managerController.edit);
router.put('/managers/', managerController.update);
router.delete('/managers/delete/', managerController.destroy);

// /user routes definition
router.param('userId', userController.load);
router.get('/users', userController.index);
router.get('/users/new', function(req, res) {
    res.render('users/new', {
        errors: []
    })
});
router.delete('/users/:userId(\\d)', userController.destroy);

module.exports = router;
