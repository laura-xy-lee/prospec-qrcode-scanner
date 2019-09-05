const express = require('express')
var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser')

require('dotenv').config();

const port = 3001
const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Connect to database
const pool = mysql.createPool({
    host     : process.env.RDS_HOSTNAME,
    user     : process.env.RDS_USERNAME,
    password : process.env.RDS_PASSWORD,
    port     : process.env.RDS_PORT
});

// Gets everything needed for web interface
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/Public/index.html'));
});
app.use(express.static(__dirname + '/Public/css'));
app.use(express.static(__dirname + '/Public/js'));

// Sends employee id and datetime to DB
var submitScanData = function(sql, password, cback){
	if (password == process.env.QRCODE_PASSWORD) {
		pool.getConnection((err, con)=>{
    		if(err) throw err;
	    	con.query(sql, (err, res, cols)=>{
	      		if(err) throw err;
				console.log('Server: Scan successful.')
				return cback('200 OK')
			})
	      	con.release(); //Done with mysql connection
	      	})
	} else {
		console.log('Server: Bad password detected.')
		return cback('403 Bad password')
	}
}

app.post('/scan', function(req, res) {
	var timestamp = req.body.timestamp
	var employeeId = req.body.employeeId
	var password = req.body.password

	var query = "INSERT INTO timesheet.scan (_timestamp, employee_id) VALUES ('"+timestamp+"', '"+employeeId+ "');"
	submitScanData(sql=query, password=password, resql=>{
		res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
		res.write(resql, 'utf-8');
		res.end();
	})
});

app.listen(process.env.PORT || port, 
	() => console.log(`QR code app listening on port ${port} ...`));
