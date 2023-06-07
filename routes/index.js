var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/admin', async function(req, res, next) {
  res.render('admin', { title: 'Express' });
});
router.post('/admin/AddSession', async function(req, res, next) {
   await req.knex("t_translations").insert({},"*")
  res.redirect('/spief2023/admin');
});


module.exports = router;
