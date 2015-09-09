var http = require("http");


var IST = new Date(); // Clone UTC Timestamp
IST.setHours(IST.getHours() + 5); // set Hours to 5 hours later
IST.setMinutes(IST.getMinutes() + 30); // set Minutes to be 30 minutes later

var day = IST.getDay();
//update day at 4:30 pm each day
// for distributing next day schedule
console.log("day:", day);
if (IST.getHours() > 16 && IST.getMinutes() > 30) {
    day = day + 1;
    if (day == 8) day = 1;
}


console.log("day:", IST.getDay() + " " + IST.getHours() + " " + IST.getMinutes());
console.log("server time: ", (new Date()).getDay() + " " + (new Date()).getHours() + " " + (new Date()).getMinutes());


var server = http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/html"});
  //response.write(IST.getHours().toString());
  //response.write(IST.getMinutes().toString());
  //response.write(IST.getDay().toString());
  //response.write(IST.getDate().toString());
  response.write(day.toString());
  
  response.end();
});

server.listen(process.env.PORT, process.env.IP);
console.log("Server is listening");