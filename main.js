const Apify = require('apify');
const util = require('util');


Apify.main(async () => {

    // Get queue and enqueue first url.
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest(new Apify.Request({ url: 'https://www.visithoustontexas.com/event/zumba-in-the-plaza/59011/' }));
    

    // Create crawler.
    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,

        // This page is executed for each request.
        // If request failes then it's retried 3 times.
        // Parameter page is Puppeteers page object with loaded page.
        handlePageFunction: getEventData,
        

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
    const title = await page.title();  
    const event = await page.$('div h1'); 
    const eventHandle = await page.evaluateHandle(body => body.innerHTML, event);
    const date = await page.$('div.dates');
    const dateHandle = await page.evaluateHandle(body => body.innerHTML, date);
    // const recurring = await page.$('div.dates');
    // const recurringHandle = await
    // Description 
    const location = await page.$('div.location');
    const locationHandle = await page.evaluateHandle(body => body.innerHTML, location);
    const address = await page.$('div.adrs');
    const addressHandle = await page.evaluateHandle(body => body.innerHTML, address);
    const contact = await page.$('div.detail-c2.left div:nth-child(6)'); // #eventDetails_4955259d-7598-4eca-9e80-3e81971a4d2f > div.detail-top > div.detail-c2.left > div:nth-child(6)
    const contactHandle = await page.evaluateHandle(body => body.innerHTML, contact, remove("strong"));

    // #nav-default > div > div.headerWrapper.theme-default > div.header-bottom > div > div.contentRender.contentRender_5.contentRender_type_widget.contentRender_name_plugins_nav_main > div.navFixedWrapper > div > div > nav > div > div:nth-child(6)

    // Phone nth-child(7) #eventDetails_4955259d-7598-4eca-9e80-3e81971a4d2f > div.detail-top > div.detail-c2.left > div:nth-child(7)
    // Time(s) nth-child(8) #eventDetails_4955259d-7598-4eca-9e80-3e81971a4d2f > div.detail-top > div.detail-c2.left > div:nth-child(8)
    // Admission nth-child(9)  #eventDetails_4955259d-7598-4eca-9e80-3e81971a4d2f > div.detail-top > div.detail-c2.left > div:nth-child(9)
    // Timestamp

    console.log(`URL: ${request.url}`, `Event name: ${eventHandle}`, `Event date: ${dateHandle}`, `Event location: ${locationHandle}`, `Event address: ${addressHandle}`, `Contact: ${contactHandle}`);
    // console.log(`Event name: ${eventHandle}`, `URL: ${request.url}`, `Event date: ${dateHandle}`, `Event location: ${locationHandle}`, `Event address: ${addressHandle}`);
    
    // Log data (util is a tool that nicely formats objects in the console)
    console.log(util.inspect(title, date, location, address));
}


