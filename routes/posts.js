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
        const {user, password, title, content} = req.body;
        const post = await Post.find({password});

        if(post.length){
            return res.status(400).json({
                success: false,
                errorMessage: 'Already Existing Password'
            })
        }

        const createPost = await Post.create({
            user, password, title, content
        });

        return res.json({ post: createPost });

    }catch(err){
        console.log(err)
        return res.status(500).send({err: err.message})
    }

})
//게시글 상세 조회 by password
router.get('/posts/:postId',async (req, res)=> {
    
    try{
        const { postId } = req.params;
        const result1 = await Post.find({});
        const result2 = result1.map((x) => {return x.password}); 

        const detail = await Post.find({password: postId});
       
        for(i = 0; i< result2.length; i++){
            if(result2[i] == Number(postId)){
                return res.send({detail})}
            else{
                return res.status(400).send("There is no password")}
        }
    }catch(err){
        console.log(err);
        return res.status(500).send({err : err.message})
    }
})
//게시글 수정하기
router.put('/posts/:password', async(req, res)=> {
    try{
        let data = await Post.updateOne(req.params,{$set: req.body}, {new: true});
        res.send(data);
    }catch(err){
        console.log(err)
        return res.status(500).send({err: err.message})
    }
})

module.exports = router;