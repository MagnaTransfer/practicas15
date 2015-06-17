var express = require('express');
var router = express.Router();
var managerController = require('../controllers/managerController.js');

var courseController = require('../controllers/courseController');

var studentController = require('../controllers/studentController.js');

/* GET home page. */
var sessionController = require('../controllers/sessionController');

/* Página de entrada GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Express', errors: []});
});

// /courses routes definition
router.get('/courses', courseController.new);
router.post('/courses', courseController.create);

router.get('/courses/all', courseController.show);

router.put('/courses/:id', courseController.update);
router.delete('/courses/:id', courseController.destroy);

/* students */
router.get('/students/new', studentController.new);
router.get('/students', studentController.index);
router.post('/students', studentController.create);
router.get('/students/:userId(\\d+)/edit', studentController.edit);
router.put('/students/:userId(\\d+)', studentController.update);
router.delete('/students/:userId(\\d+)', studentController.destroy);


//Definicion de rutas de sesion
router.get('/login', sessionController.new); // formulario login, muestra la pagina
router.post('/login', sessionController.create); //hacer login
router.get('/logout', sessionController.destroy); //hacer logout





router.param('id', managerController.load);
router.get('/manager', managerController.index);
router.get('/manager/new', managerController.new);
router.post('/manager/create', managerController.create);
router.get('/manager/:id(\\d)/edit', managerController.edit);
router.put('/manager/:id(\\d)', managerController.update);
router.delete('/manager/:id(\\d)/delete/', managerController.destroy);

module.exports = router;
