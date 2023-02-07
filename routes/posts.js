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
router.put('/posts/:p', async(req, res)=> {
    try{
        let data = await Post.updateOne(
            req.params,
            {$set: req.body}
        );
        res.send(data);

    }catch(err){
        console.log(err)
        return res.status(500).send({err: err.message})
    }
})

module.exports = router;