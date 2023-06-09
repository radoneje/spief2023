var express = require('express');
var router = express.Router();
const ExcelJS = require('exceljs');

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
        return res.send(null)
    if(dt.lang!='ru')
        return res.send(null)
    res.send("rtmp://ovsu.mycdn.me/input/"+trs[0].restream_ru);

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
router.get('/trExcel', async function(req, res, next) {
    let translations=await req.knex("t_translations").orderBy("date")
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Трансляции ПМЭФ 2023 на СберТВ');
    worksheet.getColumn(1).width=10;
    worksheet.getColumn(2).width=10;
    worksheet.getColumn(3).width=40;
    worksheet.getColumn(4).width=40;
    worksheet.getColumn(5).width=40;
    worksheet.getColumn(6).width=40;
    worksheet.getColumn(7).width=40;
    worksheet.getColumn(8).width=40;
    worksheet.getColumn(9).width=40;

    worksheet.getColumn(3).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(4).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(5).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(6).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(7).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(8).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(9).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };

    let i=0;
    worksheet.addRow(["Cписок трансляций ПМЭФ2023"])
    worksheet.addRow(['No', 'Id', "название", "VK link", "VK iframe", "VK key", "SberTV Link", "Rec ru", "rec Eng"]);
    translations.forEach(tr=>{
        i++;
        worksheet.addRow([i, tr.id, tr.date+" // "+ tr.title, tr.vklink_ru, tr.iframe, tr.restream_ru, tr.sbertv_ru, tr.rec_ru, tr.rec_en]);
    })

    res.status(200);
    res.setHeader('Content-Type', 'text/xlsx');
    res.setHeader(
        'Content-Disposition',
        'attachment; filename=SPIEF2023_translations.xlsx'
    );
   await  workbook.xlsx.write(res)
    res.end()
});






module.exports = router;
