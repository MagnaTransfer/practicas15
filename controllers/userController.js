//var users = {'uksmiss@gmail.com': {id: 1, email: "uksmiss@gmail.com", password: "1234"}};

// Comprobar si el usuario esta registrado en users
// Si falla o hay errores se ejecuta callback (error)

var models = require('../models/models.js');
var randomstring = require('randomstring');
var nodemailer = require('nodemailer');
var hasher = require('../libs/hasher.js')

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
                res.redirect('/');
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