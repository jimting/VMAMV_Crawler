var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var request = require('request');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const screen = {
  width: 640,
  height: 800
};

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/vmamv_crawler', wrap(async (req, res, next) =>{
	var url = req.query.url;
	var system = req.query.system;
	main("http://140.121.197.128:4147/", "CINEMA", res);
	
	main().catch(error => res.send('{"error" : "' + error.message + '"'));
})

app.get('/crawler_test', wrap(async (req, res, next)  =>{

	testSelenium(res);
	
	testSelenium().catch(error => res.send('{"error" : "' + error.message + '"'));
})


async function testSelenium(res)
{
	let driver = await new Builder()
        .forBrowser('firefox')
		.setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
        .build();

	await driver.get("https://www.cwb.gov.tw/V7e/forecast/taiwan/Taipei_City.htm");
	const text = await driver.findElement(By.xpath("//a[@class='NavLife']")).getAttribute("href");
	
	res.send('{"link_url" : "' + pic_url + '"}');
}


async function main(url, system_name, res) {
	let driver = await new Builder()
        .forBrowser('firefox')
		.setFirefoxOptions(new firefox.Options().headless().windowSize(screen))
        .build();

	await driver.get(url);
	
	await driver.manage().window().maximize();
	
	await driver.findElement(By.xpath("//button[@id='systemsDropdownMenuButton']")).click();
	console.log("<< Show the Service List!");
	
	//await sleep(2000);
  
	await driver.findElement(By.xpath("//button[@value='"+system_name+"']")).click();
	console.log("<< Select the "+system_name+" and show the graph!");
	
	await sleep(1000);
	
	driver.executeScript('document.body.style.MozTransform = "scale(1.0)";');
	await driver.findElement(By.xpath("//button[@id='reduce_SVG']")).click();
	await driver.findElement(By.xpath("//button[@id='reduce_SVG']")).click();
	await driver.findElement(By.xpath("//button[@id='reduce_SVG']")).click();
	console.log("<< Change the canvas scale.");
	await sleep(4000);
	
	
	await driver.findElement(By.xpath("//button[@id='system-options-menu-button']/span")).click();
	console.log("<< Open the hambur list.");
	
	await sleep(4000);
  
	await driver.findElement(By.xpath("//a[@id='download-graph']")).click();
	console.log("<< Click the download button.");
	
	await sleep(2000);
	
	const text = await driver.findElement(By.xpath("//a[@id='download-graph']")).getAttribute("href");
	console.log(">> Get the href.");
	const picUrl = await imgurUpload(text.replace("data:image/png;base64,",""));
	
	res.send('{"pic_url" : "' + pic_url + '"}');

}

function sleep(millis) {
	console.log("<< Wait for seconds.");
    return new Promise(resolve => setTimeout(resolve, millis));
}

function imgurUpload(base64)
{
	
var imgur = require('imgur');
imgur.setClientId('b9fe259fe23436f');
imgur.uploadBase64(base64)
    .then(function (json) {
        console.log(json.data.link);
		return json.data.link;
    })
    .catch(function (err) {
        console.error(err.message);
		return null;
    });
}



// catch 404 and forward to error handler
app.use(function(req, res, next) 
{
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) 
{
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
