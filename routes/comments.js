const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Comment} = require('../schemas/comment.js');
const {Post} = require('../schemas/post.js');

//비밀번호 기준으로 개별 포스트 구별하고 Comment(댓글) POST API
//하나의 게시글에 같은 password 부여 -> validation 확인
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
//Comment (댓글) GET API , 같은 PW 의 모든 Comments 들을 GET 합니다.
router.get('/comments/:postId', async ( req, res) => {
    try{
        
        const {postId} = req.params;
        const comments = await Comment.find({password: postId});
        res.send({comments})


    }catch(err){
        console.log(err);
        return res.status(500).send({err:err.message});
    }
})
//Comment PUT API, Comment's content 수정 by mongoDB Unique _id value
router.put('/comments/:postId', async (req, resp) => {
    try{
        const {postId} = req.params;

        if(!mongoose.isValidObjectId(postId))
        return resp.status(400).send({err: "invalid postId"})

        const { content } = req.body;
        if (!content) 
        return resp.status(400).send({ err: "comment changing required" });

        const update = await Comment
        .findByIdAndUpdate(postId, { content }, {new: true});

        resp.send({update});

    }catch(err){

    }
})
module.exports = router;