var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('index', { });
});
router.get('/admin', async function(req, res, next) {
  let translations=await req.knex("t_translations").orderBy("date")
  res.render('admin', {  translations});
});
router.get('/iframes', async function(req, res, next) {
    let translations=await req.knex("t_translations").orderBy("date")
    res.render('iframes', {  translations});
});
router.get('/roscongress', async function(req, res, next) {
    let translations=await req.knex("t_translations").orderBy("date")
    res.render('roscongress', {  translations});
});
router.get('/trStatusAll', async function(req, res, next) {
    let translations=await req.knex("t_translations").orderBy("date")
    res.json(translations);
});
router.get('/trRecord', async function(req, res, next) {
    if(!req.query.file)
        return res.json(404)

    let m=req.query.file.match(/^(\d+)(en|ru)/)
    let dt={trid:m[1], lang:m[2],filename:req.query.file}
    let trs=await await req.knex("t_translations").where({id:dt.trid})

    let r=await req.knex("t_records").insert(dt,"*")
    if(trs.length==0)
        return res.send(0)
    if(dt.lang!='ru')
        return res.send(1)
    res.send(JSON.stringify( trs[0]));

});
router.get('/trRecordDone', async function(req, res, next) {
    if(!req.query.file)
        return res.json(404)
    let r=await req.knex("t_records").update({done:true, doneDate:new Date()},"*").where({filename:req.query.file})
    res.json(r);
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
        console.warn(e)
        res.json(e)
    }
});
router.get('/player/:id', async function(req, res, next) {
    let translations=await req.knex("t_translations").where({id:req.params.id})
    if(translations.length==0)
        return res.sendStatus(404)
    res.render("player", {tr:translations[0]})
});
router.get('/status/:id', async function(req, res, next) {
    let translations=await req.knex("t_translations").where({id:req.params.id})
    if(translations.length==0)
        return res.sendStatus(404)
    res.json(translations[0].status)
});
router.get('/playerCtrl/:id', async function(req, res, next) {
    let translations=await req.knex("t_translations").where({id:req.params.id})
    if(translations.length==0)
        return res.sendStatus(404)
   let tr=translations[0]
    if(tr.status==1)
        return res.render("poster", {tr})
    if(tr.status==2)
        return res.render("live", {tr})
    if(tr.status==3)
        return res.render("video", {tr})

    res.render("off", {tr})
});





module.exports = router;
