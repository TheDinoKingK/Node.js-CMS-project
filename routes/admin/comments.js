const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const {userAuthenticated} = require("../../helpers/authentication");

router.all('/*', /*userAuthenticated,*/ (req, res, next) => {
    req.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Comment.find({}).populate('user').lean().then(comments => {
        res.render('admin/comments', {comments: comments});
    });
});

router.post('/', (req, res) => {
    console.log(req.body);
    Post.findOne({id: req.body.id}).then(post => {
        const newComment = new Comment({
            user: req.user,
            body: req.body.body
        });

        newComment.save().then(savedComment => {
            post.comments = post.comments.concat(savedComment);
            post.save();
            res.redirect(`/posts/a/${post._id}`);
        });


        // post.save().then(savedPost => {
        //     newComment.save().then(savedComment => {
        //         res.redirect(`/post/${post.id}`);
        //     });
        // });
    });

    // res.send('It works');
});

router.delete('/:id', (req, res) => {
    Comment.findOne({_id: req.params.id}).then(comment => {
        comment.remove();
        req.flash('delete_message', `Successfully deleted comment!`);
        res.redirect('/admin/comments');
    });
});

module.exports = router;