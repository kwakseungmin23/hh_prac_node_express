const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Comment} = require('../schemas/comment.js');
const {Post} = require('../schemas/post.js');

//비밀번호 기준으로 개별 포스트 구별하고 Comment(댓글) POST API
//하나의 게시글에 같은 password 부여 -> validation 확인 작업 필요
router.post('/comments/:postId', async (req,res)=> {
    try{
    
        const {user, content, password} = req.body;
        const { postId } = req.params;
        const find = await Post.find({password: postId});
        const found = await Post.find({password: password});
        if(!find.length){
            return res.status(400).send({err:"no password, no content"});
        }else if(!found.length){
            return res.status(400).send({err:"password does not correct"});
        }

        const createComment = await Comment.create({
            user, content, password
        });

        return res.json({ comment: createComment });

    }catch(err){
        console.log(err);
        return res.status(500).send({err: err.message});
    }
})
router.get('/comments/:postId', async ( req, res) => {
    try{
        
        const {postId} = req.params;
        const find = await Comment.find()


    }catch(err){
        console.log(err);
        return res.status(500).send({err:err.message});
    }
})

module.exports = router;