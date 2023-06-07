var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { });
});
router.get('/admin', async function(req, res, next) {
  let translations=await req.knex("t_translations").orderBy("id")
  res.render('admin', {  translations});
});
router.post('/admin/AddSession', async function(req, res, next) {
   await req.knex("t_translations").insert({},"*")
  res.redirect('/spief2023/admin');
});
router.post('/changeTr', async function(req, res, next) {
    try {
        let id=req.body.id;
        delete req.body.id;
        let r=await req.knex("t_translations").update(req.body, "*").where({id:id})
        res.json(r[0])
    }
    catch (e){
        res.json(e)
    }
});




module.exports = router;
