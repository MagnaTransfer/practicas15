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

// controllers/studentController.js

var models = require('../models/models.js');
var Sequelize = require('sequelize');

// GET /students
exports.index = function(req, res) {
    res.render('students/index');
};

// GET /students/new
exports.new = function(req, res, next) {
    var user = models.User.build({});
    var student = models.Student.build({});
    res.render('students/new', {
        user: user,
        student: student,
    });
};

// POST /students
exports.create = function(req, res, next) {
    var user = models.User.build({
        email: req.body.user.email,
        password: req.body.user.password,
        role: "STUDENT",
    });

    var student = models.Student.build({
        name: req.body.student.name,
        surname: req.body.student.surname,
        year: req.body.student.year,
        avgGrade: req.body.student.avgGrade,
        credits: req.body.student.credits,
        specialisation: req.body.student.specialisation,
    });

    user.validate().then(function(err) {
        if (err) {
            res.render('students/new', {
                user: user,
                student: student,
                errors: err.errors,
            });
        }
        else {
            student.validate().then(function(err) {
                if (err) {
                    res.render('students/new', {
                        user: user,
                        student: student,
                        errors: err.errors,
                    });
                }
                else {
                    user.save().then(function() {
                        student.save().then(function() {
                            student.setUser(user).then(function() {
                                res.redirect('/');
                            });
                        });
                    }).catch(function(error) {
                        next(error);
                    });
                }
            });
        }
    }).catch(function(error) {
        next(error);
    });

};

// DELETE /students
exports.destroy = function(req, res, next) {
    models.User.findById(req.session.user.id).then(function(user) {
        if (user) {
            user.destroy().then(function() {
                res.redirect('/logout');
            }).catch(function(error) {
                next(error);
            });
        }
        else {
            next(new Error('Usuario no encontrado.'));
        }
    }).catch(function(error) {
        next(error);
    });
};

// GET /students/edit
exports.edit = function(req, res, next) {
    models.User.findById(req.session.user.id).then(function(user) {
        if (user) {
            user.getStudent().then(function(student) {
                res.render('students/edit', {
                    student: student,
                    user: user,
                });
            });
        }
        else {
            next(new Error('Usuario inexistente.'));
        }
    }).catch(function(error) {
        next(error);
    });
};

// PUT /students
exports.update = function(req, res, next) {
    models.User.findById(req.session.user.id).then(function(user) {
        if (user) {
            user.getStudent().then(function(student) {
                student.name = req.body.student.name;
                student.surname = req.body.student.surname;
                student.year = req.body.student.year;
                student.avgGrade = req.body.student.avgGrade;
                student.credits = req.body.student.credits;
                student.specialisation = req.body.student.specialisation;

                student.validate().then(function(err) {
                    if (err)
                    /* TODO control de error */
                    ;
                    else
                        student.save().then(function() {
                            res.redirect( /* TODO redireccion */ '/students');
                        });
                });
            });
        }
        else {
            next(new Error('Usuario inexistente.'));
        }
    }).catch(function(error) {
        next(error);
    });
};

// GET /students/mycourses
exports.courses = function(req, res, next) {
    models.Student.findById(req.session.user.id).then(function(user) {
        if (user) {
            user.getCourses().then(function(courses) {
                res.render('students/courses', {
                    courses: courses,
                    errors: [],
                });
            });
        }
        else {
            next(new Error('Usuario inexistente'));
        }
    }).catch(function(error) {
        next(error);
    });
};