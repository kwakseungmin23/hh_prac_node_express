const {Schema, model} = require('mongoose');

const PostSchema = new Schema({
    
    user: { 
        type: String, 
        required: true },
    password: { 
        type: Number, 
        required: true,
        },
    title:  {
        type: String
        },
    content: { 
        type: String, 
        required: true }
    }, { timestamps: true })

const Post = model('Posts', PostSchema);
module.exports = {Post}
 