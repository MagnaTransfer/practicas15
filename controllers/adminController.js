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

exports.new = function (req, res) {
    var admin = models.User.build(
        {email: "", password: ""}
    );
    res.render('admins/new.ejs', {admin: admin});
};

exports.create = function (req, res) {
    var admin = models.User.build({
        email: req.body.admin.email,
        password: req.body.admin.password,
        role: "ADMIN"
    });
    admin.save({fields: ["email", "password", "role"]}).then(function () {
        res.redirect('/');
    })
};
