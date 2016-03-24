var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

client.execute("OPEN Colenso");
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;

router.get("/",function(req,res){
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +" (//name[@type='place'])[1] ", 
	function (error, result) {
		if(error){ 
			console.error(error);
		}
		else {
			res.render('index', { title: 'The Colenso Project', place: result.result });
			console.log("RESULT");
		}
	});
});

router.get('/search', function(req, res) {
	res.render('search', { title: 'The Colenso Project', content: req.query.searchString });
});

router.get('/add', function(req, res) {
	res.render('add', { title: 'The Colenso Project', content: req.query.searchString });
});
router.get('/browse', function(req, res) {
	res.render('browse', { title: 'The Colenso Project', content: req.query.searchString });
});
router.get('/index', function(req, res) {
	res.render('index', { title: 'The Colenso Project', content: req.query.searchString });
});

