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
    models.User.findAll().then(function (managers) {
        res.render('managers/index.ejs', {managers: managers, errors: []});
    }).catch(function (error) {
        next(error)
    });
}

exports.new = function (req, res) {
    var manager = models.User.build(
        {email: "email", password: "password"}
    );
    res.render('managers/new.ejs', {manager: manager});
};

exports.create = function (req, res) {
    var manager = models.User.build({
        email: req.body.manager.email,
        password: req.body.manager.password,
        role: "MANAGER"
    });
    manager.save({fields: ["email", "password", "role"]}).then(function () {
        res.redirect('/');
    })
};

exports.edit = function (req, res) {
    models.User.findById(req.session.user.id).then(function(manager) {
        res.render('managers/edit.ejs', {manager: manager, errors: []});
    });

}

exports.update = function (req, res) {
    models.User.findById(req.session.user.id).then(function(manager){
        manager.email=req.body.manager.email;
        manager.password=req.body.manager.password;
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
    models.User.findById(req.session.user.id).then(function(manager) {
        manager.destroy().then(function () {
            res.redirect('/logout');
        }).catch(function (error) {
            next:(error)
        });
    });
};