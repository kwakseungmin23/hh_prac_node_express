const express = require('express');
const router = express.Router();
const {Post} = require('../schemas/post.js');
const mongoose = require('mongoose');
//게시글 조회 API
router.get('/posts', async (req, res)=> {

    try{
        const foundedPosts = await 
        Post
        .find({})
        .select('user title content createdAt'); // password 를 제외합니다.
        foundedPosts.map(x => x.createdAt).sort() // 만들어진 시간순으로 정렬합니다.
        return res.send(foundedPosts);

    }catch(err){
        console.log(err)
        return res.status(500).send({err:err.message})
    }
    
})
//게시글 포스트 API
router.post('/posts', async(req, res)=> {

    try{
        let {user, password, title, content} = req.body;
        if(!user || !password || !title || !content) 
        return res
        .status(400)
        .send({err:"user,password(num),title,content required"})
        const post = new Post(req.body)
        await post.save();
        return res.send({ post })

    }catch(err){
        console.log(err)
        return res.status(500).send({err: err.message})
    }

})
//게시글 상세 조회 by MongoDB 자체 Id 값
router.get('/posts/:postId', async(req, res)=> {
    
    try{
        const {postId} = req.params;
        if(!mongoose
            .isValidObjectId(postId)) 
            return res.status(400).send({err: "invalid userId"})
        const postedId = await Post.findOne({ _id: postId});
        return res.send({postedId});
    }catch(err){
        console.log(err);
        return res.status(500).send({err : err.message})
    }
})

module.exports = router;