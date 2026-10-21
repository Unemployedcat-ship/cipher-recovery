const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'out', req.url === '/' ? 'index.html' : req.url);
    if (!path.extname(filePath)) filePath += '.html';

    fs.readFile(filePath, (err, content) => {
        if (err) res.end("Error");
        else {
            if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
            else if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'text/javascript');
            res.end(content);
        }
    });
});
server.listen(8082, '0.0.0.0');
console.log("Listening on 8082");
