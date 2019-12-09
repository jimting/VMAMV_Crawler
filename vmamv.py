from selenium.webdriver import Chrome
from selenium.webdriver.chrome.options import Options
import time
import base64
import json
import requests

def getURL (url, system_name) :
	options = Options()
	options.headless = True
	options.add_argument("--no-sandbox")
	options.add_argument("--disable-dev-shm-usage")
	driver = Chrome(chrome_options=options)
	driver.get(url)
	driver.maximize_window()
	driver.find_element_by_xpath("//button[@id='systemsDropdownMenuButton']").click()
	time.sleep(1)
	
	driver.find_element_by_xpath("//button[@value='"+system_name+"']").click()
	print("<< Select the "+system_name+" and show the graph!\n")
	
	time.sleep(2)
	
	driver.find_element_by_xpath("//button[@id='reduce_SVG']").click()
	time.sleep(1)
	driver.find_element_by_xpath("//button[@id='reduce_SVG']").click()
	time.sleep(1)
	driver.find_element_by_xpath("//button[@id='reduce_SVG']").click()
	time.sleep(1)
	driver.find_element_by_xpath("//button[@id='reduce_SVG']").click()
	time.sleep(1)
	driver.find_element_by_xpath("//button[@id='reduce_SVG']").click()
	time.sleep(1)
	print("<< Change the canvas scale.\n")
	
	time.sleep(2)
	
	driver.find_element_by_xpath("//button[@id='system-options-menu-button']/span").click()
	print("<< Open the hambur list.\n")
	
	time.sleep(4)
  
	driver.find_element_by_xpath("//a[@id='download-graph']").click()
	print("<< Click the download button.\n")
	
	time.sleep(2)
	
	text = driver.find_element_by_xpath("//a[@id='download-graph']").get_attribute("href")
	print(">> Get the href.\n")
	picUrl = imgur_upload(text.replace("data:image/png;base64,",""))
	driver.quit()
	return '{"url" : "' + picUrl + '"}'
	#const picUrl = await imgurUpload(text.replace("data:image/png;base64,",""));
	
	#return picUrl;

def test() :
	options = Options()
	options.headless = True
	options.add_argument("--no-sandbox")
	options.add_argument("--disable-dev-shm-usage")
	driver = Chrome(chrome_options=options)
	driver.get("https://www.cwb.gov.tw/V7e/forecast/taiwan/Taipei_City.htm")
	driver.maximize_window()
	pic_url = driver.find_element_by_xpath("//a[@class='NavLife']").get_attribute("href")
	return '{"url" : "' + pic_url + '"}'

def imgur_upload(b64_image) : 
	client_id = "b9fe259fe23436f"
	headers = {'Authorization': 'Client-ID ' + client_id}
	data = {'image': b64_image, 'title': 'test'} # create a dictionary.
	response = requests.post('https://api.imgur.com/3/upload.json',headers=headers,data=data)
	json_data = response.json()
	print(json_data['data']['link'])
	return json_data['data']['link']
	#request = urllib2.Request(url="https://api.imgur.com/3/upload.json", data=urllib.urlencode(data),headers=headers)
	#response = urllib2.urlopen(request).read()
	#parse = json.loads(response)
	#print(parse['data']['link'])

#print(getURL("http://140.121.197.128:4147/", "CINEMA"))
