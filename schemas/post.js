const {Schema, model} = require('mongoose');

const PostSchema = new Schema({
    
    user: { 
        type: String, 
        required: true },
    password: { 
        type: Number, 
        required: true },
    title:  {
        type: String, 
        required: true},
    content: { 
        type: String, 
        required: true }
    }, { timestamps: true })

module.exports = model('Posts', PostSchema);
 