const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const models = require('./models');
const loggingService = require('./services/loggingService')

const NAMESPACE = 'server';



// Create router
const router = express();
router.use(cors());




/* Logging the request */
router.use((req, res, next) => {
	loggingService.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

	res.on('finish', () => {
		loggingService.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
	});
	next();
});



/* Parse requests */
router.use(bodyParser.urlencoded({ extended: false }))		//routerlication/x-www-form-urlencoded
router.use(bodyParser.json({limit: '50mb'}));



/* Rules of API*/
router.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	if (req.method == 'OPTIONS') {
		res.header('Access-Control-Allow-Headers', 'GET PATCH DELETE POST PUT')
		return res.status(200).json({});
	}
	next();
})



/* Routes */
router.use('/api/countries', require('./routes/countries'));
router.use('/api/cities', require('./routes/cities'));
router.use('/api/venues', require('./routes/venues'));
router.use('/api/beers', require('./routes/beers'));
router.use('/api/users', require('./routes/users'));
router.use('/api/reports', require('./routes/reports'));




/* Error Handling */
router.use((req, res, next) => {
	const error = new Error('not found');
	return res.status(404).json({
		message: error.message
	});
})



/* Create Server */
const httpServer = http.createServer(router);
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
	loggingService.info(NAMESPACE, `Server running on ${PORT}`)
})