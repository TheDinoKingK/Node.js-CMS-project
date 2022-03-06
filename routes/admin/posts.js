const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const {isEmpty, uploadDir} = require('../../helpers/upload-helper');
const fs = require('fs');
const {userAuthenticated} = require('../../helpers/authentication');


router.all('/*', (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {

    Post.find({}).populate('category').lean().then(posts => {
        res.render('admin/posts', {posts: posts});
    });

});


router.get('/create', (req, res) => {
    Category.find({}).lean().then(categories => {
        res.render('admin/posts/create', {categories: categories});
    });
});

router.post('/create', (req, res) => {

    let errors = [];

    if (!req.body.title) {
        errors.push({message: 'please add a title'});
    }

    if (!req.body.body.length > 20) {
        errors.push({message: 'please write a article'});
    }


    if (errors.length > 0) {
        res.render('admin/posts/create', {
            errors: errors
        });
    } else {
        let fileName = 'unknown';

        // console.log(req.files);
        if (!isEmpty(req.files.file)) {
            let file = req.files.file;
            fileName = Date.now() + '-' + file.name;
            let imgDir = './public/uploads/';

            file.mv(imgDir + fileName, (err) => {
                if (err) throw err;
            });
        }

        let allowComments = true;

        allowComments = !!req.body.allowComments;

        const newPost = new Post({
            title: req.body.title,
            status: req.body.status,
            allowComments: allowComments, // req.body.allowComments ? "on" : "off",
            body: req.body.body,
            file: fileName,
            category: req.body.category,
            // comments: req.body.comments
        });

        newPost.save().then(savedPost => {

            req.flash('success_message', `Successfully created article ${savedPost.title}!`);

            res.redirect('/admin/posts');
        }).catch(error => {
            console.log(error, 'could not save post');
        });
    }


    // console.log(req.body.allowComments);
    //
    // res.send("It worked!");
});

router.get('/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).lean().then(post => {
        Category.find({}).lean().then(categories => {
            res.render('admin/posts/edit', {post: post, categories: categories});
        });
    });
});

router.put('/edit/:id', (req, res) => {

    Post.findOne({_id: req.params.id}).then(post => {
        let allowComments = !!req.body.allowComments;

        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.category = req.body.category;

        if (!isEmpty(req.files.file)) {
            let file = req.files.file;
            fileName = Date.now() + '-' + file.name;
            let imgDir = './public/uploads/';
            file.mv(imgDir + fileName, (err) => {
                if (err) throw err;
            });
        }

        post.save().then(updatedPost => {
            req.flash('edit_message', `Successfully updated article ${updatedPost.title}!`);

            res.redirect('/admin/posts');
        }).catch(error => {
            console.log(error, 'could not save edited post');
        });
    });
});

router.delete('/:id', (req, res) => {
    Post.findOne({_id: req.params.id}).lean().then(post => {

        fs.unlink(uploadDir + post.file, (err) => {
            post.remove();
            res.redirect('/admin/posts');
        });
        req.flash('edit_message', `Successfully deleted article!`);
    });
});


module.exports = router;