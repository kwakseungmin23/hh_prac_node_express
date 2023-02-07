const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../schemas/post.js');

//게시글 조회 {password 는 제외해야합니다.} => 아직못함
router.get('/posts', async (req, res)=> {

    try{
        const posts = await Post.find({});
    // posts 변수에 Post.find 몽구스 메서드를 사용한 결과.
    // [
    //  {user, password, title, content} 이렇게 온다.
    // ]  
    return res.send({posts:posts})
    }catch(err){
        console.log(err)
        return res.status(500).send({err:err.message})
    }
    
})
//게시글 포스트 
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

module.exports = router;