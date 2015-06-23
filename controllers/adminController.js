var models = require('../models/models.js');

// GET /admins
exports.index = function(req, res, next) {
    models.User.findAll({
        where: {
            role: "ADMIN"
        }
    }).then(function(admins) {
        res.render('admins/index.ejs', {
            admins: admins,
            errors: []
        });
    }).catch(function(error) {
        next(error);
    });
};

// GET /admins/new
exports.new = function(req, res) {
    var admin = models.User.build({
        email: "",
        password: ""
    });
    res.render('admins/new.ejs', {
        admin: admin
    });
};

// POST /admins
exports.create = function(req, res, next) {
    var admin = models.User.build({
        email: req.body.admin.email,
        password: req.body.admin.password,
        role: "ADMIN"
    });
    admin.save({
        fields: ["email", "password", "role"]
    }).then(function() {
        res.redirect('/');
    }).catch(function(error) {
        next(error);
    });
};
