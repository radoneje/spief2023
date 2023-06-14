var express = require('express');
var router = express.Router();
const ExcelJS = require('exceljs');
const moment = require('moment');

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
        return res.send("rtmp://ovsu.mycdn.me/input/"+trs[0].restream_en);

    await req.messageToBot("Началось: <b>id:"+trs[0].id+"</b>\n"+trs[0].title+"\n\n<a href='"+trs[0].vklink_ru+"'>смотреть в ВК</a>");
    res.send("rtmp://ovsu.mycdn.me/input/"+trs[0].restream_ru);

});
router.get('/trRecordDone', async function(req, res, next) {
    if(!req.query.file)
        return res.json(404)
    let r=await req.knex("t_records").update({done:true, doneDate:new Date()},"*").where({filename:req.query.file})
   if(req.query.file.match(/^\d+ru/)) {
        let trs = await await req.knex("t_translations").where({id: r[0].trid})
        await req.messageToBot("Окончилось: id:" + trs[0].id + "\n" + trs[0].title + "\n\n<a href='" + trs[0].vklink_ru + "'>смотреть ВК</a>");
    }
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
router.get('/player_en/:id', async function(req, res, next) {
    let translations=await req.knex("t_translations").where({id:req.params.id})
    if(translations.length==0)
        return res.sendStatus(404)
    res.render("player_en", {tr:translations[0]})
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
router.get('/playerCtrl_en/:id', async function(req, res, next) {
    let translations=await req.knex("t_translations").where({id:req.params.id})
    if(translations.length==0)
        return res.sendStatus(404)
    let tr=translations[0]
    if(tr.status==1)
        return res.render("poster_en", {tr})
    if(tr.status==2)
        return res.render("live_en", {tr})
    if(tr.status==3)
        return res.render("video_en", {tr})

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
    worksheet.getColumn(10).width=40;
    worksheet.getColumn(11).width=40;
    worksheet.getColumn(12).width=40;

    worksheet.getColumn(3).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(4).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(5).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(6).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(7).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(8).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(9).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(10).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(11).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    worksheet.getColumn(12).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };

    let i=0;
    worksheet.addRow(["Cписок трансляций ПМЭФ 2023"])
    worksheet.getRow(1).getCell(1).font={ size: 16, bold: true}
    worksheet.addRow(['No', 'Id', "название", "VK link ру ","VK link en", "VK iframe", "VK key ru","VK key en", "SberTV рус", "SberTV en",  "Запись ru", "Запись Eng"]);
    for(let i=1; i<=12; i++) {
        worksheet.getRow(2).getCell(i).font={ size: 14, bold: true}
    }

    translations.forEach(tr=>{
        i++;
        worksheet.addRow([
            i,
            tr.id,
            tr.date+" \n"+ tr.title,
            tr.vklink_ru,
            tr.vklink_en,
            tr.iframe,
            tr.restream_ru,
            tr.restream_en,
            tr.sbertv_ru,
            tr.sbertv_en,
            tr.rec_ru?("https://static.sber.link/aij2022streams/spief2023/"+tr.rec_ru):"",
            tr.rec_en?("https://static.sber.link/aij2022streams/spief2023/"+tr.rec_en):""
        ]);
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

router.get('/trSbertvExcel', async function(req, res, next) {
    let translations=await req.knex("t_translations").orderBy("date")
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Трансляции ПМЭФ 2023 на СберТВ');

    for(let i=1; i<=11; i++) {
        if(i==1)
            worksheet.getColumn(1).width=10;
        else
            worksheet.getColumn(i).width=60;
        worksheet.getColumn(i).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    }


    let i=0;
    worksheet.addRow(["версия от:", moment().format("DD.MM.YYYY HH:mm:ss")])
    worksheet.getRow(1).getCell(1).font={ size: 12, bold: true}
    worksheet.getRow(1).getCell(2).font={ size: 12, bold: true}
    worksheet.getRow(1).getCell(2).alignment = {vertical: 'middle', horizontal: 'left', wrapText: true};
    worksheet.addRow(['Номер', 'Полный заголовок для СберТВ', "Короткий заголовок", "Описание", "Обложка (jpg, строго до 200 Кб)", "Код VK (информация от СберТВ)", "Код плеера для СберТВ","Тестовый ключ (сюда можно подать сигнал и проверить поток 24x7)","Ссылка на сайт СберТВ (работает под сертификатом Минцифры)", "Запись"]);
    for(let i=1; i<=11; i++) {
        worksheet.getRow(2).getCell(i).font={ size: 14, bold: true}
    }

    translations.forEach(tr=>{
        i++;
        //let row=worksheet.addRow([i, tr.id, tr.date+" \n"+ tr.title, tr.vklink_ru, tr.iframe, tr.restream_ru, tr.sbertv_ru, tr.rec_ru, tr.rec_en]);
        let row=worksheet.addRow()
        row.getCell(1).value=i+"\nID:"+tr.id+"ru";
        row.getCell(2).value=tr.date.replace(" июня", ".06 //").replace(/\-\s?\d\d\:\d\d/, "")+". "+ tr.title;
        row.getCell(3).value=tr.shortName
        row.getCell(4).value=tr.descr
        row.getCell(5).value="https://static.sber.link/aij2022streams/spief2023/spief2023ru.jpg"
        row.getCell(6).value="\nСЕРВЕР: rtmp://ovsu.mycdn.me/input/\nКЛЮЧ:"+tr.restream_ru
        +"\n\nКОД IFRAME:\n"+tr.iframe
        +"\n\nПРЯМАЯ ССЫЛКА:\n"+tr.vklink_ru
        +"\n\nПОТОК ОТКРОЕТСЯ АВТОМАТИЧЕСКИ ЗА 5 МИНУТ ДО НАЧАЛА ТРАНСЛЯЦИИ\n";
        row.getCell(7).value=""
        if(tr.iframe && tr.iframe.length>10){
            let match=tr.iframe.match(/src=\"([^"]+)\"/)
            if(match)
                row.getCell(7).value=match[1]
        }
        row.getCell(8).value="НЕТ"
        row.getCell(9).value=tr.sbertv_ru
        //row.getCell(10).value=tr.rec_ru
        if(tr.rec_ru)
            //row.getCell(10).hyperlink = { mode: 'external', target:"https://static.sber.link/aij2022streams/spief2023/"+ tr.rec_ru };
            row.getCell(10).value ="https://static.sber.link/aij2022streams/spief2023/"+ tr.rec_ru


        for(let j=6;j<=9;j++)
            row.getCell(j).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFF00" },
            };
        for(let j=1;j<=11;j++) {
            let cell=row.getCell(j)
            cell.alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
            cell.border = {
                top: { style: "thin" },//thick
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" }
            };
        }

        ///EN///////////EN
        if(tr.date_en) {
            i++;
            row = worksheet.addRow()
            row.getCell(1).value = i + "\nID:" + tr.id + "EN";

            row.getCell(2).value = tr.date_en + ". " + tr.title_en;

            row.getCell(3).value = tr.shortName_en
            row.getCell(4).value = tr.descr_en
            row.getCell(5).value = "https://static.sber.link/aij2022streams/spief2023/spief2023en.jpg"
            row.getCell(6).value = "\nСЕРВЕР: rtmp://ovsu.mycdn.me/input/\nКЛЮЧ: " + tr.restream_en
                + "\n\nКОД IFRAME:\n" + tr.iframe_en
                + "\n\nПРЯМАЯ ССЫЛКА:\n" + tr.vklink_en
                + "\n\nПОТОК ОТКРОЕТСЯ АВТОМАТИЧЕСКИ ЗА 5 МИНУТ ДО НАЧАЛА ТРАНСЛЯЦИИ\n";
            row.getCell(7).value = ""
            if (tr.iframe_en && tr.iframe_en.length > 10) {
                let match = tr.iframe_en.match(/src=\"([^"]+)\"/)
                if (match)
                    row.getCell(7).value = match[1]
            }
            row.getCell(8).value = "НЕТ"
            row.getCell(9).value = tr.sbertv_en
            if(tr.rec_en)
                row.getCell(10).value ="https://static.sber.link/aij2022streams/spief2023/"+ tr.rec_en


            for (let j = 6; j <= 9; j++)
                row.getCell(j).fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: {argb: "FFFF00"},
                };
            for (let j = 1; j <= 11; j++) {
                let cell = row.getCell(j)
                cell.alignment = {vertical: 'middle', horizontal: 'center', wrapText: true};
                cell.border = {
                    top: {style: "thin"},//thick
                    left: {style: "thin"},
                    bottom: {style: "thin"},
                    right: {style: "thin"}
                };
            }
        }


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



router.get('/showFiles/:trid/:lang', async function(req, res, next) {
    try {
        let files =await req.knex("t_records").where({trid:req.params.trid,lang:req.params.lang }).orderBy("id","desc")
            res.render("showFiles", {files})
    }
    catch (e){
        console.warn(e)
        res.sendStatus(500)
    }
});

router.get('/showPlayer/:file', async function(req, res, next) {
    try {
            res.render("showPlayer", {file:req.params.file})
    }
    catch (e){
        console.warn(e)
        res.sendStatus(500)
    }
});
router.get('/setTrRec/:trid/:lang/:file', async function(req, res, next) {
    try {
        let dt={}
        dt["rec_"+req.params.lang]=req.params.file
        let r =await req.knex("t_translations").update(dt, "*").where({id:req.params.trid})
        res.render("trRecord", {file:r[0]["rec_"+req.params.lang]})
    }
    catch (e){
        console.warn(e)
        res.sendStatus(500)
    }
});


router.get('/cutFile/:fileid/:markin/:markout', async function(req, res, next) {
    try {
        let dt={}

        let r =await req.knex("t_records").where({id:req.params.fileid})
        let newfilename=r[0].filename.replace(/\.mp4$/,"_cut_"+moment().format("HH:mm")+"_.mp4")
        let match=req.params.markin.match(/(\d\d):(\d\d):(\d\d)/)
        let secIn=parseInt(match[1])*3600+parseInt(match[2])*60+parseInt(match[3])
         match=req.params.markout.match(/(\d\d):(\d\d):(\d\d)/)
        let secOut=parseInt(match[1])*3600+parseInt(match[2])*60+parseInt(match[3])

        let total=secOut-secIn;
        let dur=moment().startOf('day').add(total, "second").format("HH_mm_ss")

        await req.knex("t_cut").insert({
            fileid:r[0].id,
            markin:req.params.markin,
            markout:req.params.markout,
            newfilename,
            dur
        });

       res.json({total,secOut,secIn;})
    }
    catch (e){
        console.warn(e)
        res.sendStatus(500)
    }
});



module.exports = router;
