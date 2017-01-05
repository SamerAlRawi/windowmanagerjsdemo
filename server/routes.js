const express = require('express');
const router = express.Router();
const fs = require('fs');

const electronBuilder = require('./electronBuilder');
const openFinJson = require('./openFinJson');

//Expose windowmanager main file
router.get('/windowmanager.js', function(req, res, next){
    res.sendFile('windowmanager.js', { root: 'windowmanagerjs/dist' });
});

//Install page for OpenFin Application
router.get('/install', function(req, res, next){
    res.sendFile('install.html', { root: 'public' });
});

//Install page for Electron Application
router.get('/electron', function(req, res, next){
    electronBuilder()
        .then(e => fs.readFile(e.filePath, (err, data) => {
            res.setHeader('Content-Disposition', `attachment; filename="${e.fileName}"`);
            res.setHeader('Content-type', e.mimeType);
            res.send(data);
        })).catch((error) => {
            console.error(error);
        });
});

//Generate app.json dynamically based on calling ip
router.get('/app.json', function(req, res, next) {
    //Set the json to reference ipaddress and send it back
    let json = openFinJson(req.headers.host);
    res.setHeader('Content-type', 'application/json');
    res.send(json);
});

module.exports = router;