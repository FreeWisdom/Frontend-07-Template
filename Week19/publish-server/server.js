let http = require("http")
let https = require("https")
let unzipper = require("unzipper")
let querystring = require("querystring")
const { callbackify } = require("util")

/**
 * 2、auth路由：接收 code ；
 * 3、auth路由：用 code + client_id + client_secret 
 * 
 * 6、publish路由：token 获取用户信息，检查权限；
 * 7、publish路由：接受发布；
 */

function auth(request, response) {
    
    // 2、auth路由：接收 code ；
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1])
    console.log("auth____query:", query.code) // query: [Object: null prototype] { code: 'd1d18db1375e6589d7ef' }

    // 3、auth路由：用 code + client_id + client_secret 换 token；
    getToken(query.code, function(info) {
        console.log("auth____info", info);
        response.write(`<a href="http://localhost:8083?token=${info.access_token}">send token to publish-tool/publish(8083)</a>`);
        response.end();
    });
}

function getToken(code, callback) {
    let request = https.request({
        hostname: "gitHub.com",
        path: `/login/oauth/access_token?code=${code}&client_id=Iv1.56c92eea64ca270d&client_secret=a5c7ca868a0accb3475bf46dd19192e839cd6029`,
        port: 443,
        methods: "POST"
    }, function(response) {
        let body = "";
        response.on("data", chunk => {
            body += (chunk.toString());
        })
        response.on("end", chunk => {
            callback(querystring.parse(body));
        })
    });
    request.end();
}

function getUser(token, callback) {
    let request = https.request({
        hostname: "api.gitHub.com",
        path: `/user`,
        port: 443,
        methods: "GET",
        headers: {
            Authorization: `token ${token}`,
            "User-Agent": "toy-publish"
        }
    }, function(response) {
        let body = "";
        response.on("data", chunk => {
            body += (chunk.toString());
        })
        response.on("end", chunk => {
            callback(JSON.parse(body))
        })
    });
    request.end();
}

function publish(request, response) {
    let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1])

    // 6、publish路由：token 获取用户信息，检查权限；
    getUser(query.token, function(info) {

        // 7、publish路由：接受发布；
        if(info.login === "FreeWisdom") {
            // 将压缩后的文件解压
            request.pipe(unzipper.Extract({ path: '../server/public' }));
            request.on("end", function() {
                response.end("success!")
            })
        }
    });
}

http.createServer(function(request, response) {
    if(request.url.match(/^\/auth\?/))
        return auth(request, response)
    if(request.url.match(/^\/publish\?/))
        return publish(request, response)
}).listen(8082)