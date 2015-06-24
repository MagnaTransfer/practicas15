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
var randomstring = require('randomstring');
var nodemailer = require('nodemailer');
var hasher = require('../libs/hasher.js')

exports.autenticar = function (login, password, callback) {
	models.User.findOne({
		where: {email :login, password: hasher.encrypt(password)}
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

exports.new = function (req, res) {
    var user = models.User.build(
        {email: "", password: "", role: "MANAGER"}
    );
    res.render('users/new.ejs', {user: user});
};

exports.create = function (req, res) {
    var user = models.User.build({
        email: req.body.user.email,
        password: hasher.encrypt(req.body.user.password),
        role: req.body.user.role
    });
    if (req.body.user.password === req.body.user.password2) {
        user.save({fields: ["email", "password", "role"]}).then(function () {
            res.redirect('/users');
        });
    }
    else {
        res.render('users/new', {user: user, errors: [new Error("Las contraseñas no coinciden")]});
    }
};

exports.destroy = function (req, res) {
    req.user.destroy().then(function () {
        res.redirect('/users');
    }).catch(function (error) {
        next:(error)
    });
};


exports.forgot = function(req,res){
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('users/forgot', {
        errors: errors
    });
}

exports.send = function(req,res, next){
    console.log('start')
    var email = req.body.email;
    console.log(email);
    models.User.find({
        where: {
            email: email
        }
    }).then(function(user){
        console.log(user);
        if(user){
            console.log(user);
            var ident = randomstring.generate();
            var link ="http://"+req.get('host')+"/reset?c="+ident;
            console.log(link);

            user.resetCode=ident;
            user.save({fields: ["resetCode"]}).then(function(){
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'magnanode@gmail.com',
                        pass: 'Magna1234.'
                    }
                });

                transporter.sendMail({
                    from: 'magnanode@gmail.com',
                    to: email,
                    subject: 'Recuperar la contraseña',
                    html : "Hola,<br> Por favor presiona el enlace para recuperar tu contraseña.<br><a href="+link+">Presiona aquí para recuperar</a>"
                });
                var errors = [];
                errors[0] = new Error("Te hemos enviado un mensaje de correo electrónico. Por favor, revisa tu bandeja de entrada.")
                res.render('index', {
                    title: 'Express',
                    errors: errors,
                });
            })
        }
        else{
            callback(new Error('No existe ningún usuario con ese email.'));
        }
    }).catch(function (error) {
        next(error);
    });
}

exports.reset = function(req,res,next){
    var errors = req.session.errors || {};
    req.session.errors = {};

    var code = req.query.c;
    models.User.find({
        where: {
            resetCode: code
        }
    }).then(function(user){
        if(user) {
            console.log(user.email);
            res.render('users/reset', {
                user: user,
                errors: errors
            });
        }
        else{
            next(new Error('El enlace no es correcto.'));
        }
    })
}

exports.change = function(req,res,next){
    var id = req.body.id;
    console.log(id);
    var password = req.body.password;
    console.log(password);

    models.User.find({
        where: {
            id: id
        }
    }).then(function(user){
        if(user) {
            var encriptedPassword = hasher.encrypt(password);
            user.password = encriptedPassword;
            user.resetCode = '';
            user.save({fields: ["password","resetCode"]});
            res.redirect("/");
        }
        else{
            next(new Error('No existe ningún usuario con ese email.'));
        }
    })
}

// GET /users/edit
exports.edit = function (req, res, next) {
    models.User.findById(req.session.user.id).then(function (user) {
        if (user) {
            res.render('users/edit', {});
        }
        else {
            next(new Error('Usuario inexistente.'));
        }
    }).catch(function (error) {
        next(error);
    });
};

// PUT /users
exports.updatePass = function (req, res, next) {
    if (req.body.new === req.body.new2) {
        models.User.findOne({
            where: {
                email: req.session.user.email,
                password: hasher.encrypt(req.body.user.password)
            }
        }).then(
            function (user) {
                if (user) {
                    user.password = hasher.encrypt(req.body.new);
                    user.save({fields: ["password"]}).then(
                        function () {
                            res.render('index', {alerts: ["Usuario actualizado correctamente."]});
                        }
                    ).catch(function (error) {
                            next(error);
                        });
                } else {
                    res.render('users/edit', {errors: [{message: "La contraseña actual no es correcta."}]});
                }
            })
    } else {
        res.render('users/edit', {errors: [{message: "Las contraseñas no coinciden"}]});
    }
};
