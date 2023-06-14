var createError = require('http-errors');

var path = require('path');
var config = require('./config.json');
const {spawn} = require('child_process');

var indexRouter = require('./routes/index');

const knex = require('knex')({
    client: 'pg',
    connection: config.pgConnection,
    searchPath: ['knex', 'public'],
});


cut();

async function cut() {

    let tasks = await knex("t_cut").where({done: false})

    for (let task of tasks) {
        let rec = await knex("t_records").where({id: task.fileid})
        let params = [
            "-ss", task.markin,
            "-i", "/var/mnt/spief2023/" + rec[0].filename,
            "-c", "copy",
            "-movflags", "faststart",
            "-y",
            "/var/mnt/spief2023/" + task.newfilename

        ]
        let ffmpeg = spawn("ffmpeg", params);
        ffmpeg.stdout.on('data', function (chunk) {
            var textChunk = chunk.toString('utf8');
            console.log(textChunk);
        });
        ffmpeg.stderr.on('data', function (chunk) {
            var textChunk = chunk.toString('utf8');
            console.error(textChunk);
        });
        ffmpeg.on('exit', async function () {
            await knex("t_cut").update({done: true}).where({id: task.id})
            await knex("t_records").insert({
                filename: task.newfilename,
                done: true,
                doneDate: new Date(),
                trid: rec[0].trid,
                lang: rec[0].lang,
            })
        });
    }

    setTimeout(cut, 10 * 1000);
}
