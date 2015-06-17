var express = require('express');
var router = express.Router();

var courseController = require('../controllers/courseController');

var studentController = require('../controllers/studentController.js');

/* GET home page. */
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

module.exports = router;
