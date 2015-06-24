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


// MW de autorizacion de accesos HTTP restringidos
exports.loginRequired = function (req, res, next) {
    if (req.session.user) {
        next();
    }
    else {
        res.redirect('/login');
    }
};

exports.logoutRequired = function (req,res,next){
    if(req.session.user){
        res.redirect('/');
    }
    else{
        next();
    }
}

exports.roleRequired = function (role1, role2) {
    return function (req, res, next) {
        if (req.session.user.role === role1 || req.session.user.role === role2) {
            next();
        }
        else {
            /* TODO personaliza error */
            res.status(405).render('index', {errors: [new Error('Acceso no autorizado')]});
        }
    }
};

//Get /login  Formulario de login
exports.new = function (req, res) {
    var errors = req.session.errors || {};
    req.session.errors = {};

    res.render('session/new', {
        errors: errors
    });
};

//POST login hacer el login
exports.create = function (req, res) {

    var login = req.body.login;
    var password = req.body.password;

    var userController = require('./userController');
    userController.autenticar(login, password, function (error, user) {

        if (error) { // si hay error, retornamos mensajes de error de sesion
            req.session.errors = [{
                "message": error.toString()
            }];
            res.redirect("/login");
            return;
        }

        //Crear req.session.user y guardar campos id e email
        //La sesion se define por la existencia de: req.session.user
        req.session.user = {id: user.id, email: user.email, role: user.role};
        res.redirect(req.session.redir.toString()); //redireccion a path anterior a login
    });
};

// DELETE logout , hacer logout
exports.destroy = function (req, res) {
    delete req.session.user;
    res.redirect("/"); // redirect a path anterior a login
}
