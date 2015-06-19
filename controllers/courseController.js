var models = require('../models/models.js');

// GET /courses
exports.new = function(req, res) {
    var course = models.Course.build({
        name: "",
        description: "",
        specialisation: "IS",
        credits: 0,
        vacancies: 0
    });
    res.render('courses/new.ejs', {
        course: course,
        errors: []
    });
};

// POST /courses
exports.create = function(req, res, next) {
    console.log(req.body.course);
    var course = models.Course.build(req.body.course);
    course.validate().then(
        function(err) {
            if (err) {
                res.render('courses/new.ejs', {
                    course: course,
                    errors: err.errors
                });
            }
            else {
                course.save({
                    fields: ["name", "description", "specialisation", "credits", "vacancies"]
                }).then(
                    function() {
                        console.log("usuario guardado correctamente");
                        res.redirect('/');
                    }
                );
            }
        }
    ).catch(function(error) {
        next(error);
    });
};

// PUT /courses/:id
exports.update = function(req, res, next) {
    req.course.name = req.body.course.name;
    req.course.description = req.body.course.description;
    req.course.specialisation = req.body.course.specialisation;
    req.course.credits = req.body.course.credits;
    req.course.vacancies = req.body.course.vacancies;

    req.course.validate().then(
        function(err) {
            if (err) {
                res.render('courses/' + req.course.id, {
                    user: req.user,
                    errors: err.errors
                });
            }
            else {
                req.course.save({
                    fields: ["name", "description", "specialisation", "credits", "vacancies"]
                }).then(
                    function() {
                        res.redirect('/');
                    }
                );
            }
        }
    ).catch(function(error) {
        next(error);
    });
};

// DELETE /courses/:id
exports.destroy = function(req, res, next) {
    req.course.destroy().then(function() {
        res.redirect('/');
    }).catch(function(error) {
        next(error);
    });
};

// GET /courses/all
exports.show = function(req, res) {
    models.Course.findAll().then(function(courses) {
        res.render('courses/index', {
            courses: courses,
            errors: []
        });
    });
};

// GET /courses/:courseId
exports.course = function(req, res) {
    models.Course.findById(req.params.courseId).then(function(course) {
        res.render('courses/show', {
            course: course,
            errors: []
        });
    });
};

// POST /courses/pick
exports.pick = function(req, res) {
    models.Course.findById(req.body.cid).then(function(course) {
        models.Student.find({
            where: {
                UserId: req.session.user.id
            }
        }).then(function(student) {
            course.addStudent(student);
            /* TODO mostrar mensaje antes en vez de redireccionar? */
            res.redirect('/students/mycourses');
        });
    });
};