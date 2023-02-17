'use stric'
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const process = require('process');

// express confing
const app = express();
app.set('view engine', 'ejs');
app.use(express.static( __dirname + '/static'))
app.use(cors({ 'origin': '*' }))
app.use(express.json());
const port = process.argv[2] || 3000;

// db config
const db_path = __dirname + '/db/database.json';
const file_path = __dirname + '/raw_data'

// inititalize folder
function init() {
    if (!fs.existsSync(db_path)) {
        fs.writeFileSync(db_path, JSON.stringify({}, null, 4))
    }

    if (!fs.existsSync(file_path)) {
        fs.mkdirSync(file_path);
    }

    return true
}

// database
async function checkExistingKey(key) {
    const db_data = JSON.parse(fs.readFileSync(db_path).toString())
    const keys = Object.keys(db_data)
    if (keys.indexOf(key) >= 0) {
        return true
    } else {
        return false
    }
}

async function update_data(key, data) {
    const db_data = JSON.parse(fs.readFileSync(db_path))
    const isExist = await checkExistingKey(key)
    if (!isExist) {
        db_data[key] = {
            lock: false,
            password: null,
            raw_data_name: key
        }
        fs.writeFileSync(db_path, JSON.stringify(db_data, null, 4))
        console.log(db_data)
    }
    fs.writeFileSync(file_path + '/' + key, data)
}

async function read_data(key) {
    const raw_data = fs.readFileSync(file_path + '/' + key)
    return raw_data.toString()
}

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/:noteid', (req, res) => {
    res.render('index');
})

app.get('/api/:noteid', async (req, res) => {
    const key = req.params.noteid
    const isExist = await checkExistingKey(key)
    if (isExist) {
        const read_note = await read_data(key)
        res.status(200).send(read_note)
    } else {
        res.status(200).send(false)
    }
}) 

app.post('/api/:noteid', async (req, res) => {
    const key = req.params.noteid
    const raw_data = req.body.value
    const isExist = await checkExistingKey(key)
    if (isExist) {
        const updateData = update_data(key, raw_data.toString())
    } else {
        const updateData = update_data(key, raw_data.toString())
    }
    res.status(200).send('OK')
})

app.get('/raw/:noteid', async (req, res) => {
    const key = req.params.noteid;
    const isExist = await checkExistingKey(key);
    if (isExist) {
        const raw_data = fs.readFileSync(file_path + '/' + key)
        res.setHeader('content-type', 'text/plain')
        res.status(200).send(raw_data.toString())
    } else {
        res.status(404).send('invalid note_id!')
    }
})

app.get('/:noteid/raw', async (req, res) => {
    const key = req.params.noteid;
    const isExist = await checkExistingKey(key);
    if (isExist) {
        const raw_data = fs.readFileSync(file_path + '/' + key)
        res.setHeader('content-type', 'text/plain')
        res.status(200).send(raw_data.toString())
    } else {
        res.status(404).send('invalid note_id!')
    }
})

app.get('/dl/:noteid', async (req, res) => {
    const key = req.params.noteid;
    const isExist = await checkExistingKey(key);
    if (isExist) {
        res.setHeader('Content-disposition', 'attachment; filename=' + key + '.txt');
        res.setHeader('Content-type', 'application/octet-stream');

        res.download(file_path + '/' + key, key + '.txt', (err) => {
            if (err) {
                res.sendStatus(404);
            }
        })
    } else {
        res.status(404).send('invalid note!')
    }
})

app.get('/:noteid/dl', async (req, res) => {
    const key = req.params.noteid;
    const isExist = await checkExistingKey(key);
    if (isExist) {
        res.setHeader('Content-disposition', 'attachment; filename=' + key + '.txt');
        res.setHeader('Content-type', 'application/octet-stream');

        res.download(file_path + '/' + key, key + '.txt', (err) => {
            if (err) {
                res.sendStatus(404);
            }
        })
    } else {
        res.status(404).send('invalid note!')
    }
})

init();
app.listen(port, () => {
    console.log(`app listen on port ${port}`)
})