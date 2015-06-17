var models = require('../models/models.js');

exports.load = function(req,res,next,id){
    models.User.find({
        where:{
            id: Number(id)
        }
    }).then(function(manager){
        if(manager){
            req.manager = manager;
            next();
        }else{next(new Error('No existe id='+id))}
    }).catch(function(error){next(error)});
};

exports.index = function(req, res){
    models.User.findAll().then(function(managers){
        res.render('managers/index.ejs', {managers: managers, errors: []});
    }).catch(function(error){next(error)});
}

exports.new = function(req,res){
    var manager = models.User.build(
        {email: "email", password:"password", role:"MANAGER"}
    );
    res.render('managers/new.ejs', {manager: manager});
};

exports.create = function(req, res){
    var manager = models.User.build(req.body.manager);
    manager.save({fields: ["email", "password", "role"]}).then(function(){
        res.redirect('/manager');
    })
};

exports.edit = function(req,res){
    var manager = req.manager;
    res.render('managers/edit.ejs', {manager: manager, errors:[]});
}

exports.update = function(req, res){
    req.manager.email = req.body.manager.email;
    req.manager.password = req.body.manager.password;

    req.manager.validate().then(function(err){
        if(err){
        res.render('/manager/', {manager: req.manager, errors: err.errors});
    }
    else
    {
        req.manager.save({fields: ["email", "password"]}).then(function () {
            res.redirect('/manager/');
        });
    }
    }
    );
};

exports.destroy = function(req, res){
    req.manager.destroy().then(function(){
        res.redirect('/manager');
    }).catch(function(error){next:(error)});
};