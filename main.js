const Apify = require('apify');
const util = require('util');


Apify.main(async () => {

    // Get queue and enqueue first url.
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest(new Apify.Request({ url: 'https://www.visithoustontexas.com/event/zumba-in-the-plaza/59011/' }));
    
    // const requestList = await Apify.openRequestList();
    // await requestList.addRequest(new Apify.RequestList({ 
    //     sources: [
    //     {url: 'https://www.visithoustontexas.com/event/zumba-in-the-plaza/59011/' },
    //     {url: 'https://www.visithoustontexas.com/events/'}
    //     ]
    // }));
    

    // Create crawler.
    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,

        // This page is executed for each request.
        // If request failes then it's retried 3 times.
        // Parameter page is Puppeteers page object with loaded page.
        handlePageFunction: getEventData,
        // handlePageFunction: getEventList,
        

        // If request failed 4 times then this function is executed.
        handleFailedRequestFunction: async ({ request }) => {
            console.log(`Request ${request.url} failed 4 times`);
        },
    });

    // Run crawler.
    await crawler.run();
    
});



const getEventData = async ({ page, request }) => {

    // Function to get data from page
    // const title = await page.title();  
    const event = await page.$('div h1'); 
    const eventHandle = await page.evaluateHandle(body => body.innerHTML, event);
    const date = await page.$('div.dates');
    const dateHandle = await page.evaluateHandle(body => body.innerHTML, date);
    const recurring = await page.$('div.detail-c2.left div:nth-child(3)');
    const recurringHandle = await page.evaluateHandle(body => body.innnerHTML, recurring);
    // Description 
    const description = await page.$('div.description.clearfix');
    const descHandle = await page.evaluateHandle(body => body.innnerHTML, description);
    // #tab-details > div
    const location = await page.$('div.location');
    const locationHandle = await page.evaluateHandle(body => body.innerHTML, location);
    const address = await page.$('div.adrs');
    const addressHandle = await page.evaluateHandle(body => body.innerHTML, address);
    
    const contact = await page.$('div.detail-c2.left div:nth-child(6)'); 
    const contactHandle = await page.evaluateHandle(body => body.innerHTML, contact);
    const phone = await page.$('div.detail-c2.left div:nth-child(7)'); 
    const phoneHandle = await page.evaluateHandle(body => body.innerHTML, phone);
    const time = await page.$('div.detail-c2.left div:nth-child(8)'); 
    const timeHandle = await page.evaluateHandle(body => body.innerHTML, time);    // Admission nth-child(9)  #eventDetails_4955259d-7598-4eca-9e80-3e81971a4d2f > div.detail-top > div.detail-c2.left > div:nth-child(9)
    // Timestamp 

    console.log(`URL: ${request.url}` + "\n", `Event name: ${eventHandle}`+ "\n", `Event description: ${descHandle}` + "\n", `Event date: ${dateHandle}`+ "\n", `Recurring: ${recurringHandle}` + "\n", `Event location: ${locationHandle}`+ "\n", `Event address: ${addressHandle}`+ "\n", `Contact: ${contactHandle}`+ "\n", `Phone: ${phoneHandle}`+ "\n", `Time: ${timeHandle}`);
    
    // Log data (util is a tool that nicely formats objects in the console)
    console.log(util.inspect(eventHandle, false));
    console.log(util.inspect(dateHandle, false));
    console.log(util.inspect(locationHandle, false));
}

// const getEventList= async ({ page }) => {
    // scrape the event links
    // const eventLink = await page.$('div.title a');

    // console.log(`Event link: ${eventLink}`);
// }
