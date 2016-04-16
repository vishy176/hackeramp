'use strict'
import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db';
import middleware from './middleware';
import api from './api';
import path from 'path';
var vision = require('google-vision-api-client');

var app = express();
app.server = http.createServer(app);

// 3rd party middleware
app.use(cors({
	exposedHeaders: ['Link']
}));

app.use(bodyParser.json({
	limit : '100kb'
}));

app.get("/",function(req,res){
	res.send("harsha");

var requtil = vision.requtil;

//Prepare your service account from trust preview certificated project
//var jsonfile = '/Users/11131/express-es6-rest-api/server/key.json';
var jsonfile = path.join(__dirname,"key.json");

//Initialize the api
vision.init(jsonfile);

//Build the request payloads
var d = requtil.createRequests().addRequest(
	requtil.createRequest('/Users/11131/Desktop/TestImages/1.jpg')
		.withFeature('FACE_DETECTION', 3)
		.withFeature('LABEL_DETECTION', 2)
		.build());

//Do query to the api server
vision.query(d, function(e, r, d){
	if(e) console.log('ERROR:', e);
  console.log(JSON.stringify(d));
});


});

// connect to db
db( λ => {

	// internal middleware
	app.use(middleware());

	// api router
	app.use('/api', api());

	app.server.listen(process.env.PORT || 8080);

	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
