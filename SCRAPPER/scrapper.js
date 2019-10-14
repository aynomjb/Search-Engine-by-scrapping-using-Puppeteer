const puppeteer = require('puppeteer')

// Scrapping Methods
exports.getDataFromTrustPilot = async (query, cb) => {
    scrapTrustPilotSingle(query, cb)
}
exports.getDataFromTrustedShops = async (query, cb) => {
    scrapTrustShopSingle(query, cb)
}


// will scrap from TrustPilot
async function scrapTrustPilotSingle(query, cb) {
    let newBrowser = await puppeteer.launch({
        headless: false
    })
    let trustPilotPage = await newBrowser.newPage()
    await trustPilotPage.setViewport({
        width: 1366,
        height: 768
    })
    await trustPilotPage.goto('https://www.trustpilot.com/review/' + query, {
        timeout: 300000
    })
    await trustPilotPage.waitFor(1000)
    let data = {}
    let elements = await trustPilotPage.$$eval(".company-badges > div >div >div >a>div >span", as => as.map(a => a.innerText));
    data['Domain Name'] = elements[0]
    if (elements.length == 0) {
       await     newBrowser.close()
        cb({
            success: false,
            message: "no results"
        })
     
    } else {

        // Parse the trustPilotPage for required details
        elements = await trustPilotPage.$$eval(".badge-card__title", as => as.map(a => a.innerText));
        data['Claimed (YES/NO)'] = elements[1]
        elements = await trustPilotPage.$$eval(".header-section h2", as => as.map(a => a.innerText));
        data['Reviews Count'] = elements[0]
        elements = await trustPilotPage.$$eval(".trustscore", as => as.map(a => a.attributes[0].value));
        data['Rating in stars and rating score'] = elements[0]
        elements = await trustPilotPage.$$eval(".business-unit-profile-summary__image", as => as.map(a => a.attributes[2].value));
        data['Domain-Image'] = elements[0]
        elements = await trustPilotPage.$$eval(".categories > div >a", as => as.map(a => a.innerText));
        data['category'] = elements[0]
        elements = await trustPilotPage.$$eval(".company-description__text", as => as.map(a => a.innerText));
        data['Description'] = elements[0]



        await     newBrowser.close()
        cb({
            success: true,
            data: data
        })
      
    }
}


// will scrap from Trusted-Shops
async function scrapTrustShopSingle(query, cb) {
    let newBrowser = await puppeteer.launch({
        headless: false
    })
    let trustedShopsPage = await newBrowser.newPage()
    await trustedShopsPage.setViewport({
        width: 1366,
        height: 768
    })
    await trustedShopsPage.goto(`http://www.trustedshops.de/shops/?q=${encodeURIComponent(query)}`, {
        timeout: 300000
    })

    await trustedShopsPage.waitFor(2000)
    let foundResults = await trustedShopsPage.$$eval(".shop-actions > div > div >a", as => as.map(a => a.href));
  
    if (foundResults.length == 0) {
        await     newBrowser.close()
        cb({
            success: false,
            message: "no results"
        })
       
    } else {

        await trustedShopsPage.goto(foundResults[0], {
            timeout: 300000
        })
        let data = {}


        // Parse the trustedShopsPage for required details
        let elements = await trustedShopsPage.$$eval(".certRow >div ", as => as.map(a => a.innerText))
        data["Certificate Vlid Till Date"] = elements[4]
        elements = await trustedShopsPage.$$eval(".averageThankYou ", as => as.map(a => a.innerText))
        data["Rating in stars and rating score"] = elements[0]
        elements = await trustedShopsPage.$$eval(".shopDesc > div > a", as => as.map(a => a.innerText))
        data["category"] = elements
        elements = await trustedShopsPage.$$eval(".shopDesc > p ", as => as.map(a => a.innerText))
        data["Description"] = elements
        elements = await trustedShopsPage.$$eval("#reviewProfileScreenshotLink > img", as => as.map(a => a.src))
        data["Domain-Image"] = elements[0]
        elements = await trustedShopsPage.$$eval(".ratingSummary-legalText > div >strong", as => as.map(a => a.innerText))
        data["Reviews Count"] = elements[0]
        elements = await trustedShopsPage.$$eval(".shopName ", as => as.map(a => a.innerText))
        data['Shop Name'] = elements[0]
        
        await newBrowser.close()
        cb({
            success: true,
            data: data
        })
        
    }
}