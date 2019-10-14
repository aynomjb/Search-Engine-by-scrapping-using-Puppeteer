
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')

process.env.PORT = 80

// EXPRESS SERVER CONFIG
app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.use(express.static('resources/views'))
app.set('views',__dirname + '/resources/views')
app.listen( process.env.PORT, console.log(`app is running at port ${ process.env.PORT }`))

//IMPORT ROUTES
app.use('/', require('./routes/main'))
app.use('/api', require('./routes/api'))
app.get('*', (req, res, next) => {
	res.send("404 NOT FOUND")
})