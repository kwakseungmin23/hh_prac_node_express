const {Schema, model} = require('mongoose');

const commentSchema = new Schema({
    
    user: { 
        type: String,
        required: true
        },

    password: { 
        type: Number, 
        required: true
        },

    content: { 
        type: String, 
        required: true }
    }, { timestamps: true })

const Comment = model('Comments', commentSchema);
module.exports = {Comment}