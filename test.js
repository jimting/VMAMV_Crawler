const {Builder, By, Key, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const screen = {
  width: 640,
  height: 800
};
async function main(url, system_name) {
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
	
	return picUrl;

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

console.log(main("http://140.121.197.128:4147/", "CINEMA"));

