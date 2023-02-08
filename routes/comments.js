const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Comment} = require('../schemas/comment.js');
const {Post} = require('../schemas/post.js');

//비밀번호 기준으로 개별 포스트 구별하고 Comment(댓글) POST API
//하나의 게시글에 댓글별로 다른 password 부여
router.post('/comments/:postId', async (req,res)=> {
    try{
    
        const {user, content, password} = req.body;
        const { postId } = req.params;
        const find = await Post.find({password: postId});
        if(!find.length){
            return res.status(400).send({err:"no password, no content"})
        }

        const createComment = await Comment.create({
            user, content, password
        });

        return res.json({ comment: createComment });

    }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message})
    }
})


module.exports = router;