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

var models = require('../models/models.js');

exports.load = function (req, res, next, id) {
    models.User.find({
        where: {
            id: Number(id)
        }
    }).then(function (manager) {
        if (manager) {
            req.manager = manager;
            next();
        } else {
            next(new Error('No existe id=' + id))
        }
    }).catch(function (error) {
        next(error)
    });
};

exports.index = function (req, res) {
    models.User.find({
        where: {
            role: "MANAGER"
        }
    }).then(function (managers) {
        res.render('managers/index.ejs', {managers: managers, errors: []});
    }).catch(function (error) {
        next(error)
    });
};

exports.new = function (req, res) {
    var manager = models.User.build(
        {email: "", password: ""}
    );
    res.render('managers/new.ejs', {manager: manager});
};

exports.create = function (req, res) {
    var manager = models.User.build({
        email: req.body.manager.email,
        password: req.body.manager.password,
        role: "MANAGER"
    });

    if (req.body.condiciones === "aceptado") {
        manager.validate().then(function (err) {
                if (err) {
                    res.render('managers/new.ejs', {
                        manager: manager,
                        errors: err.errors
                    });
                } else {
                    manager.save({
                        fields: ["email", "password", "role"]
                    }).then(
                        function () {
                            res.redirect('/');
                        }
                    );
                }
            }
        ).catch(function (error) {
                next(error);
            });
    } else {
        var errors = [];
        errors[0] = new Error('No se han aceptado los términos y condiciones de uso.');
        res.render('managers/new', {
            manager: manager,
            errors: errors,
        });
    }
};

exports.edit = function (req, res) {
    models.User.findById(req.session.user.id).then(function (manager) {
        res.render('managers/edit.ejs', {manager: manager, errors: []});
    });

}

exports.update = function (req, res) {
    models.User.findById(req.session.user.id).then(function (manager) {
        manager.email = req.body.manager.email;
        manager.password = req.body.manager.password;
        manager.validate().then(function (err) {
                if (err) {
                    res.render('/manager/', {manager: req.session.manager, errors: err.errors});
                }
                else {
                    manager.save({fields: ["email", "password"]}).then(function () {
                        res.redirect('/manager/');
                    });
                }
            }
        );
    })

};

exports.destroy = function (req, res) {
    models.User.findById(req.session.user.id).then(function (manager) {
        manager.destroy().then(function () {
            res.redirect('/logout');
        }).catch(function (error) {
            next:(error)
        });
    });
};