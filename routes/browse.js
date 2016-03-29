var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

client.execute("OPEN Colenso");

router.get('/browse', function(req, res) {
	res.render('browse', { title: 'The Colenso Project', content: req.query.searchString });
});