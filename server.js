const { timeStamp } = require('console');
const http = require('http')
const express = require('express');

const app = express();

const start = Date.now()

app.get('/health', (req, res) =>{
    const data = {
        nama: "Sanie Ghanda Prawira",
        nrp: "5025231009",
        status: "UP",
        timestamp : new Date().toISOString(),
        uptime: `${Math.floor((Date.now() - start) / 1000)} seconds`
        
    }
    res.json(data)
})

const server = http.createServer(app);
server.listen(3000);