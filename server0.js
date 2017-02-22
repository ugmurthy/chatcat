'use strict';
const express = require('express');
const app = express();

app.set('port',process.env.PORT || 3000);

// middleware functions as plugins
// here we declare it
let helloMiddleware = (req,res,next) => {
	req.hello = 'Hello! Its me! I was wondering.....you get the idea!';
	next();
}
// app.use plugs' in the plugin or middleware
// optionally the middleware can bound to specific route
// in the example below the middleware is processed for routes
// /dashboard and /dashboard/* but not for / or /anyother
app.use('/dashboard', helloMiddleware);


// multiple route handler functions can be arranged in an array like below
// to allow pre-processing of the request
// app.get('/',[() => {//1}, ()=>{//2}])
app.get('/',(req,res,next) => {
	req.greeting = 'Hello';
	req.target = "ChatCat 1.0.0";
	console.log(req.hello);
	next();
}, (req,res,next) => {
	res.send('<h1>'+req.greeting+" "+req.target+'</h1>');
});

app.get('/dashboard', (req,res,next) => {
	res.send("<h1>This is the dashboard page! Middleware says "+req.hello+"</h1>")
});

app.listen(app.get('port'), () => {console.log("ChatCat running on port: ",app.get('port'));
});








