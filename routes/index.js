var express = require('express');
var router = express.Router();
const db = require('../services/db').getDb();

router.use('*', (req, res, next) => {
  if (req.baseUrl === '/login' || !!req.currentUser) {
    next();
  } else {
    res.status(401).send({error: 'Access denied! ' + req.baseUrl });
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({});
});

router.post('/login', (req, res, next) => {
  const user = db.get('users')
    .find({username: req.body.username, password: req.body.password})
    .value();

    if (!user) {
      return res.status(400).send('Invalid username or password');
    }

    res.send({
      token: user.token,
      username: user.username
    });
});

router.get('/posts', (req, res, next) => {
  res.send(db.get('posts'));
});

router.get('/post/:id', (req, res, next) => {
  const post = db
    .get('posts')
    .find({ id: parseInt(req.params.id, 10) })
    .value();

  if (post) {
    res.send(post);
  } else {
    return res.status(404).send({error: `Post ${req.params.id} not found`});
  }
});

router.put('/post/:id', (req, res, next) => {
  
  db.get('posts')
    .find({ id: parseInt(req.params.id, 10) })
    .assign({title: req.body.title, body: req.body.body})
    .write();

  const post = db
    .get('posts')
    .find({ id: parseInt(req.params.id, 10) })
    .value();
    res.send({post});
});

router.post('/post', (req, res, next) => {

  const posts = db
    .get('posts')
    .map('id')
    .value();

    const newId = Math.max.apply(null, posts) + 1 || 1;

  const newPost = db
    .get('posts')
    .insert({
      id: newId,
      userId: 1,
      title: req.body.title, 
      body: req.body.body,
      createdAt: new Date()
    })
    .write()

    res.send(newPost);
});


module.exports = router;
