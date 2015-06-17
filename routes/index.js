var express = require('express');
var router = express.Router();

var courseController = require('../controllers/courseController');

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

module.exports = router;
