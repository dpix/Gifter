var express = require('express')
var fs = require('fs')
var app = express()

app.use(express.static('public'));

app.post('/signup', function(req, res){
	var body = '';
	filePath = __dirname + '/data/emails.txt';
	req.on('data', function(data) {
		body += data;
	});

	req.on('end', function (){
		fs.appendFile(filePath, body, function(err) {

			if(err) throw err;
			res.redirect('/thanks.html');
		});
	});
})

var server = app.listen(3000, function () {

	var host = server.address().address
	var port = server.address().port

	console.log('Gifter listening at http://%s:%s', host, port)

})