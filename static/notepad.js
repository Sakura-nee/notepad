'use stric'

function update(noteId, value) {
    if(!noteId || !value) return false;

    const http = new XMLHttpRequest();
    const apiurl = sitename + '/api/' + noteId;
    const data = {
        nodeId: noteId,
        value: value
    }

    http.open('POST', apiurl, true);
    http.setRequestHeader('Content-type', 'application/json');
    http.send(JSON.stringify(data))
    return true
}

async function read_note(noteId) {
    if(!noteId) return false

    const http = new XMLHttpRequest();
    const apiurl = sitename + '/api/' + noteId;
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (http.responseText !== 'false' || http.responseText === false) {
                document.querySelector('#note').value = http.responseText
            }
        }
    }
    http.open('GET', apiurl, true)
    http.send()
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

const sitename = window.location.protocol + '//' + window.location.host;
const getpath = window.location.pathname.split('/')
const key = getpath.filter(function(e) { return e })

if(key.length === 0) {
    window.location = '/' + makeid(9)
}

const note_id = key[0];

(async function () {
    await read_note(note_id)
})()
document.querySelector('#note').addEventListener('change', () => {
    const noteVal = document.querySelector('#note')
    if (noteVal) update(note_id, noteVal.value.toString())
})


// mouse event
const save = document.querySelector('#save');
const raw  = document.querySelector('#raw');
const dl   = document.querySelector('#download');

save.addEventListener('mouseover', function () { show_btname('save', 'display') }, false);
save.addEventListener('mouseout', function () { show_btname('save', 'hide') }, false);
raw.addEventListener('mouseover', function () { show_btname('raw', 'display') }, false);
raw.addEventListener('mouseout', function () { show_btname('raw', 'hide') }, false);
dl.addEventListener('mouseover', function () { show_btname('download', 'display') }, false);
dl.addEventListener('mouseout', function () { show_btname('download', 'hide') }, false);

// save.addEventListener('click', function () { window.location.pathname = '/save/' })
raw.addEventListener('click', function () { window.location.pathname = '/' + note_id + '/raw' });
dl.addEventListener('click', function () { window.location.pathname = '/' + note_id + '/dl' });

function show_btname(name, status) {
    if (status === "display") {
        (document.querySelector('#button_name').classList.contains('hidden')) ? document.querySelector('#button_name').classList.remove('hidden') : false;
        document.querySelector('#button_name').innerHTML = '<div>' + name + '</div>';
    } else if (status === "hide") {
        (document.querySelector('#button_name').classList.contains('hidden')) ? false : document.querySelector('#button_name').classList.add('hidden');
        document.querySelector('#button_name').innerHTML = '<div></div>';
    }
}