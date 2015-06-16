var express = require('express');
var router = express.Router();
var managerController = require('../controllers/managerController.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.param('id', managerController.load);
router.get('/manager', managerController.index);
router.get('/manager/new', managerController.new);
router.post('/manager/create', managerController.create);
router.get('/manager/:id(\\d)/edit', managerController.edit);
router.put('/manager/:id(\\d)', managerController.update);
router.delete('/manager/:id(\\d)/delete/', managerController.destroy);

module.exports = router;
