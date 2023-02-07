const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
mongoose.set('debug', true);
const connect = () => {
    mongoose
        .connect('mongodb+srv://Seungmin_Kwak:rhkrtmdals98@cluster0.3hbka9r.mongodb.net/dbsparta')
        .catch(err => console.log(err));
};

mongoose.connection.on('error', err => {
    console.error('몽고DB 연결 에러', err);
});

module.exports = connect