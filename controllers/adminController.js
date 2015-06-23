var models = require('../models/models.js');
var hasher = require('../libs/hasher.js')


exports.index = function (req, res) {
    models.User.find({
        where: {
            role: "ADMIN"
        }
    }).then(function (managers) {
        res.render('admins/index.ejs', {admins: admins, errors: []});
    }).catch(function (error) {
        next(error)
    });
};

exports.new = function (req, res) {
    var admin = models.User.build(
        {email: "", password: ""}
    );
    res.render('admins/new.ejs', {admin: admin});
};

exports.create = function (req, res) {
    var admin = models.User.build({
        email: req.body.admin.email,
        password: hasher.encrypt(req.body.admin.password),
        role: "ADMIN"
    });
    admin.save({fields: ["email", "password", "role"]}).then(function () {
        res.redirect('/');
    })
};
