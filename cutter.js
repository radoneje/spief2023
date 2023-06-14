var createError = require('http-errors');

var path = require('path');
var config = require('./config.json');

var indexRouter = require('./routes/index');

const knex = require('knex')({
    client: 'pg',
    connection: config.pgConnection,
    searchPath: ['knex', 'public'],
});


cut();

async function cut(){

    let tasks=await knex("t_cut").where({done:false})

    for(let task of tasks){
        let rec=await knex("t_records").where({id:task.fileid})
        let params =[
            "-ss", task.markin,
            "-i", "/var/mnt/spief2023/"+task.rec[0].filename,
            "-c","copy",
            "-movflags", "faststart",
            "-y",
            "/var/mnt/spief2023/"+task.newfilename

        ]
        console.log(params)
    }
}
