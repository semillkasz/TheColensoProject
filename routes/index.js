var express = require('express');
var router = express.Router();

var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");

client.execute("OPEN Colenso");

var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({storage: storage});
router.use(upload.single('file'));

module.exports = router;


/** - - - - HOME PAGE - - - - - */
router.get("/",function(req,res){
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +" (//name[@type='place'])[1] ", 
	function (error, result) {
		if(error){ 
			console.error(error);
		}
		else {
			res.render('index', { title: 'The Colenso Project'});
			console.log("RESULT");
		}
	});
	
});

/** - - - - SEARCH PAGE - - - - - */
router.get('/search', function(req, res) {
	var textQuery = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
    " for $t in (collection('Colenso'))" +
    " where $t[string() contains text { '"+req.query.searchString+"' } any]" +
    " let $p := db:path($t)" +
    " group by $p" +
    " return <p><a href='/view?doc={$p}'>{$t//title/text()}</a></p>";

    var markupQuery = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';  " + 
    "for $t in "+ req.query.searchMarkup +
    " let $p := db:path($t)" +
    " group by $p" +
    " return <p><a href='/view?doc={$p}'>{$p}</a></p>";

    var logicString = "'" + req.query.searchLogic + "'";
    logicString = logicString.replace(" AND ", '\' ftand \'')
    					.replace(" OR ", '\' ftor \'')
    					.replace(" NOT ", '\' ftnot \'');
    var logicQuery = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
    " for $t in //TEI[. contains text "+ logicString + " using wildcards]" +
    " let $p := db:path($t)" +
    " group by $p" +
    " return <p><a href='/view?doc={$p}'>{$t//title/text()}</a></p>";


    if(req.query.searchString){
		client.execute(textQuery, 
			function (error, result) {
				if(error){ console.error(error); }
				else {
					res.render('search', { title: 'The Colenso Project', output: result.result, 
						searchString: req.query.searchString});
					console.log("RESULT");
				}
		});
	} else if(req.query.searchMarkup){
		client.execute(markupQuery, 
			function (error, result) {
				if(error){ console.error(error); }
				else {
					res.render('search', { title: 'The Colenso Project', output: result.result, 
						searchMarkup: req.query.searchMarkup});
					console.log("RESULT");
				}
		});
	} else if(req.query.searchLogic){
		client.execute(logicQuery, 
			function (error, result) {
				if(error){ console.error(error); }
				else {
					res.render('search', { title: 'The Colenso Project', output: result.result, 
						searchLogic: req.query.searchLogic});
					console.log("RESULT");
				}
		});
	}else {
		res.render('search', { title: 'The Colenso Project', content: "", searchString: "" });
		console.log("RESULT");
	}
});

/** - - - - ADD PAGE - - - - - */
router.get('/add', function(req, res) {
	res.render('add', { title: 'The Colenso Project', content: req.query.searchString });
});


/** - - - - Private Letters Page - - - - */
router.get('/private_letters', function(req, res) {
	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
    " for $t in (collection('Colenso'))" +
    " where $t[string() contains text { 'private letter' } any]" +
    " let $p := db:path($t)" +
    " group by $p" +
    " return <p><a href='/view?doc={$p}'>{$t//title/text()}</a></p>";
	client.execute(query, 
	function (error, result) {
		if(error){ 
			console.error(error);
		}
		else {
			res.render('private_letters', { title: 'The Colenso Project', priv_letters: result.result });
			console.log("RESULT");
		}
	});
});

/** - - - - Diaries Page - - - - */
router.get('/diaries', function(req, res) {
	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
    " for $t in (collection('Colenso'))" +
    " where $t[string() contains text { 'diary' } any]" +
    " let $p := db:path($t)" +
    " group by $p" +
    " return <p><a href='/view?doc={$p}'>{$t//title/text()}</a></p>";
	client.execute(query, 
	function (error, result) {
		if(error){ 
			console.error(error);
		}
		else {
			res.render('diaries', { title: 'The Colenso Project', diaries: result.result });
			console.log("RESULT");
		}
	});
});

/** - - - - Publication Letters Page - - - - */
router.get('/publications', function(req, res) {
	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
    " for $t in (collection('Colenso'))" +
    " where $t[string() contains text { 'publication' } any]" +
    " let $p := db:path($t)" +
    " group by $p" +
    " return <p><a href='/view?doc={$p}'>{$t//title/text()}</a></p>";
	client.execute(query, 
	function (error, result) {
		if(error){ 
			console.error(error);
		}
		else {
			res.render('publications', { title: 'The Colenso Project', pub_letters: result.result });
			console.log("RESULT");
		}
	});
});

/** - - - - Judgement Letters Page - - - - */
router.get('/judgements', function(req, res) {
	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
    " for $t in (collection('Colenso'))" +
    " where $t[string() contains text { 'judgements' } any]" +
    " let $p := db:path($t)" +
    " group by $p" +
    " return <p><a href='/view?doc={$p}'>{$t//title/text()}</a></p>";
	client.execute(query, 
	function (error, result) {
		if(error){ 
			console.error(error);
		}
		else {
			res.render('judgements', { title: 'The Colenso Project', judgement_letters: result.result });
			console.log("RESULT");
		}
	});
});

/** - - - - Newspaper Letters Page - - - - */
router.get('/newspaper_letters', function(req, res) {
	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
    " for $t in (collection('Colenso'))" +
    " where $t[string() contains text { 'newspaper' } any]" +
    " let $p := db:path($t)" +
    " group by $p" +
    " return <p><a href='/view?doc={$p}'>{$t//title/text()}</a></p>";
	client.execute(query, 
	function (error, result) {
		if(error){ 
			console.error(error);
		}
		else {
			res.render('newspaper_letters', { title: 'The Colenso Project', news_letters: result.result });
			console.log("RESULT");
		}
	});
});

/** - - - - VIEW PAGE - - - - */
router.get('/view', function(req, res) {	
  if(req.query.doc){
    client.execute("XQUERY doc('Colenso/"+req.query.doc+"')",
      function (error, result) {
        if(error){ console.error(error);}
        else {
          res.render('view', { content: result.result, title: 'The Colenso Project' });
        }
      }
    );
  } else {
    res.render('view', { content: req.query.doc });
  }
});

/** - - - - UPLOAD - - - - */
router.post('/upload', function(req, res){
	if(req.file){
		var xml = req.file.buffer.toString();
		client.execute('ADD TO "Colenso/' + req.file.originalname + '" "' + xml + '"',
			function(error, result){
				if(error){
					console.error(error);
				} else {
					res.render('add', { title: 'The Colenso Project', uploaded: true});
					console.log("File uploaded");
				}
		});
	} else {
		res.render('add', { title: 'The Colenso Project', uploaded: false});
	}
});

/** - - - - EDIT - - - - */
router.post('/edit', function(req, res){
	
});

/** - - - - DOWNLOAD - - - - */
router.get('/download', function(req, res) {

});
