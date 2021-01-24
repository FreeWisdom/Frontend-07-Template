const { Console } = require('console');
const http = require('http');

// 创建 Web 服务器。
const server = http.createServer((req, res) => {
    let body = [];
    req.on('error', (err) => {
        console.log(err);
    }).on('data', (chunk) => {
        console.log("chunk:", chunk, chunk.toString());
        body.push(chunk);
    }).on('end', () => {
        console.log("body1:", body);
        body = Buffer.concat(body).toString();
        console.log("body2:", body);
        res.writeHead(200, {
            "Content-Type": "text/html"
        });
        res.end("hello word zhz\n")
    })
});

// 启动服务器
server.listen(8088, () => {
    console.log('服务器已启动');
  // 停止服务器
//   server.close(() => {
//     console.log('服务器已停止');
//   });
});
