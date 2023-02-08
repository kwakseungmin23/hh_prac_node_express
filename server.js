const express = require('express');
const app = express();

const postsRouter = require('./routes/posts')
const commentsRouter = require('./routes/comments')

const connect = require('./schemas');
connect();

app.use(express.json());
app.use('/api', [postsRouter, commentsRouter]);

app.get('/', (req, res) => {
    res.send('Bullet In Board Practicing');
});

app.listen(3000, () => {
    console.log(3000, 'Server listening on port 3000');
});

