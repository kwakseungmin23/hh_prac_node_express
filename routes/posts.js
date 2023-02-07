const express = require('express');
const router = express.Router();
const {Post} = require('../schemas/post.js');

//게시글 조회 {password 는 제외해야합니다.} => 아직못함
router.get('/posts', async (req, res)=> {

    try{
        const foundedPosts = await Post.find();
        foundedPosts.map(x => x.createdAt).sort() //만들어진 시간순 정렬
        return res.send(foundedPosts);

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