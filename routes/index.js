/**
 *   placeForMe -
 *   Copyright (C) 2015 by Magna SIS <magnasis@magnasis.com>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var express = require('express');
var router = express.Router();
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
router.param('courseId', courseController.load);
router.get('/courses/new', courseController.new);
router.post('/courses', courseController.create);
router.get('/courses', courseController.index);
router.get('/courses/:courseId(\\d+)/edit', courseController.edit);
router.put('/courses/:courseId(\\d+)', courseController.update);
router.delete('/courses/:courseId(\\d+)', courseController.destroy);
router.get('/courses/:courseId(\\d+)', courseController.show);
router.post('/courses/pick', courseController.pick);

/* students */
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

// /user routes definition
router.param('userId', userController.load);
router.get('/users', userController.index);
router.get('/users/new', userController.new);
router.post('/users', userController.create);
router.delete('/users/:userId(\\d+)', userController.destroy);

module.exports = router;
