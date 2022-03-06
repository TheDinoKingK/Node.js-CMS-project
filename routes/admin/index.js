const express = require('express');
const router = express.Router();
const {faker} = require('@faker-js/faker');
const Post = require('../../models/Post');
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*', userAuthenticated, (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    res.render('admin/index');
});

router.post('/generate-fake-posts', (req, res) => {
    for (let i = 0; i < req.body.amount; i++) {
        let post = new Post();

        post.title = faker.name.title();
        post.status = 'public';
        post.allowComments = faker.datatype.boolean();
        post.body = faker.lorem.paragraphs();
        post.file = faker.image.image();

        post.save().then(savedPost => {
        });
    }

    res.redirect('/admin/posts');
})

// router.get('/dashboard', (req, res) => {
//     res.render('admin/dashboard');
// });


module.exports = router;