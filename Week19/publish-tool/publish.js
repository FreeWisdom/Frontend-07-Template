let http = require("http")
let fs = require("fs")
let child_process = require("child_process")
let querystring = require("querystring")

/**
 * 1、打开：https://github.com/login/oauth/authorize；
 * 
 * 4、创建客户端服务器，以便接受 token；
 * 5、接受 token ，携带 token 点击发布；
 */


// 1、打开：https://github.com/login/oauth/authorize；
child_process.exec(`open https://github.com/login/oauth/authorize?client_id=Iv1.56c92eea64ca270d`)

// 4、创建客户端服务器，以便接受 token；
http.createServer(function(request, response) {
    let query = querystring.parse(request.url.match(/^\/\?([\s\S]+)$/)[1])
    
    // 5、接受 token ，携带 token 点击发布；
    publish(query.token);
}).listen(8083)

function publish(token) {
    let request = http.request({
        hostname: "127.0.0.1",
        port: 8082,
        path: "/publish?token=" + token,
        method: "POST",
        headers: {
            "Content-Type": "application/octet-stream",
        }
    }, response => {
        console.log(response);
        // request.end("succese!");
        // response.end("<h1>success!</h1>")
    })
    
    // 对(sample)文件夹下的内容进行压缩
    const archiver = require('archiver');
    const archive = archiver("zip", {
        zlib: { level: 9 }
    });
    archive.directory("./sample/", false);
    archive.finalize(); // 表示为压缩工具填好了压缩内容
    archive.pipe(fs.createWriteStream("tmp.zip"));
    
    // 将压缩后的文件流倒入request流
    archive.pipe(request);
}