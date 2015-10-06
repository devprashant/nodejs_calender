var http = require("http");
var fs = require("fs");
var path = require("path");

var files = {};
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT;
var host = process.env.IP || process.env.OPENSHIFT_NODEJS_IP;
var assets = function(req, res){
    
//Convert time to Indian Standard Time
var IST = new Date(); // Clone UTC Timestamp
IST.setHours(IST.getHours() + 5); // set Hours to 5 hours later
IST.setMinutes(IST.getMinutes() + 30); // set Minutes to be 30 minutes later

var sendError = function(message, code){
    if(code === undefined)  {
        code = 404;
    }
    res.writeHead(code, {'Content-Type' : 'text/html'});
    res.end(message);
};

var serve = function(file){
    var contentType;
    switch(file.ext.toLowerCase()){
        case "css": contentType = "text/css"; break;
        case "html": contentType = "text/html"; break;
        case "js": contentType = "application/javascript"; break;
        case "ico": contentType = "application.ico"; break;
        case "json": contentType = "application/json"; break;
        case "jpg": contentType = "image/jpeg"; break;
        case "jpeg": contentType = "image/jpeg"; break;
        case "png": contentType = "image/png"; break;
        default: contentType = "text/plain";
    }
    res.writeHead(200, {'Content-Type': contentType});
    res.end(file.content);
    /*
    res.writeHead(200, {'Content-Type' : 'text/html'});
    res.write("day:"+ day + "<br/>");
    res.write("day:"+ IST.getDay() + " " + IST.getHours() + " " + IST.getMinutes() + "<br>");
    res.write("server time: "+ (new Date()).getDay() + " " + (new Date()).getHours() + " " + (new Date()).getMinutes());
    res.end();*/
    
};

var readFile = function(filePath){
    if (files[filePath]){
        serve(files[filePath]);
    } else {
        fs.readFile(filePath, function(err, data){
            if(err){
                sendError('Error reading ' + filePath + '.');
                return;
            }
            files[filePath] = {
                ext: filePath.split(".").pop(),
                content: data
            };
            serve(files[filePath]);
        });
    }
}

var str = '/cse';
var reqi = req.url;
var joinedPath = str + reqi;
console.log(joinedPath);

var day = IST.getDay();
//update day at 4:30 pm each day
// for distributing next day schedule
console.log("day:", day);
if (IST.getHours() > 16 && IST.getMinutes() > 30) {
    day = day + 1;
    if (day == 6) day = 1;
}

if (day == 0) day = day + 1;

console.log("day now for data processing:", day);
console.log("IST Time:", IST.getDay() + " " + IST.getHours() + " " + IST.getMinutes());
console.log("server time: ", (new Date()).getDay() + " " + (new Date()).getHours() + " " + (new Date()).getMinutes());
switch(day){
    case 1:
        readFile(path.normalize(__dirname + joinedPath +'/mon.json'));
        break;
    case 2:
        readFile(path.normalize(__dirname + joinedPath +'/tue.json'));
        break;
    case 3:
        readFile(path.normalize(__dirname + joinedPath +'/wed.json'));
        break;
    case 4:
        readFile(path.normalize(__dirname + joinedPath +'/th.json'));
        break;
    case 5:
        readFile(path.normalize(__dirname + joinedPath +'/fri.json'));
        break;
    case 6:
        readFile(path.normalize(__dirname + joinedPath +'/sat.json'));
        break;
    case 7:
        readFile(path.normalize(__dirname + joinedPath +'/mon.json'));
        break;
    default:
        //readFile(path.normalize(__dirname + '/cse/exam.json'));
        break;
}

};


var app = http.createServer(assets).listen(port,host);
console.log("Listening on " + host + ":" + port);