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

//var users = {'uksmiss@gmail.com': {id: 1, email: "uksmiss@gmail.com", password: "1234"}};

// Comprobar si el usuario esta registrado en users
// Si falla o hay errores se ejecuta callback (error)

var models = require('../models/models.js');

exports.autenticar = function (login, password, callback) {
	models.User.findOne({
		where: {email :login, password: password}
	}).then(function(user){
		
		if(user){
			callback(null, user)
		}else{
			callback(new Error('No existe ningún usuario con ese email, o la contraseña es incorrecta'));
		}
	}).catch(function(error){
		callback(new Error('Ha habido un error en la consulta'));
	})
};


/*
    if (users[login]) {
        if (password === users[login].password) {
            callback(null, users[login]);
        }
        else {
            callback(new Error('Contraseña incorrecta'));
        }
    } else {
        callback(new Error('No existe ningún usuario con ese email'));
 }
 };*/

exports.load = function (req, res, next, id) {
    models.User.find({
        where: {
            id: Number(id)
        }
    }).then(function (user) {
        if (user) {
            req.user = user;
            next();
        } else {
            next(new Error('No existe id=' + id))
        }
    }).catch(function (error) {
        next(error)
    });
};

exports.index = function (req, res) {
    models.User.findAll().then(function (users) {
        res.render('users/index', {users: users, errors: []});
    }).catch(function (error) {
        next(error)
    });
};

exports.destroy = function (req, res) {
    req.user.destroy().then(function () {
        res.redirect('/');
    }).catch(function (error) {
        next:(error)
    });
};