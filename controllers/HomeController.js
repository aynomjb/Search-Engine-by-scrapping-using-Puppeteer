

const SCRAPPER = require('../SCRAPPER/scrapper')


// ALL METHODS
exports.getView = (req, res, next) => {
	res.render('homeView')
}


exports.searchInTrustPilot = (req, res, next) => {
	if(!req.body.query)
	{
		res.json({success: false, message: "query field not defined!"})
	}
	else
	{   
	
		SCRAPPER.getDataFromTrustPilot(req.body.query, (data) => {
		res.json(data)
	})
	}

}
 
exports.searchInTrustedShops = (req, res, next) => {
		if(!req.body.query)
	{
		res.json({success: false, message: "query field not defined!"})
	}
	else
	{


	SCRAPPER.getDataFromTrustedShops(req.body.query, (data) => {
		res.json(data)
	})	
}
}