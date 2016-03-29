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
	//var raw_input = req.query.searchString

	// var input = decodeURI(raw_input)
	// 	.replace(" AND ", '\' ftand \'')
	// 	.replace(" NOT ", '\' ftnot \'')
	// 	.replace(" OR ", '\' ftor \'');

	var query = "XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
    " for $t in (collection('Colenso'))" +
    " where $t[string() contains text { '"+req.query.searchString+"' } any]" +
    " let $p := db:path($t)" +
    " group by $p" +
    " return <p><a href='/view?doc={$p}'>{$t//title/text()}</a></p>";
    if(req.query.searchString){
		client.execute(query, 
			function (error, result) {
				if(error){ console.error(error); }
				else {
					res.render('search', { title: 'The Colenso Project', output: result.result, 
						searchString: req.query.searchString});
					console.log("RESULT");
				}
		});
	} else {
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


/** - - - - DOWNLOAD - - - - */
router.get('/download', function(req, res) {
  	var url = req.originalUrl;
	var path = url.replace('/download/', '');
	client.execute("XQUERY doc('"+path+"')",
		function(error, result) {
			if (error) {
				console.error(error);
			}
			else {
				var doc = result.result;
				var filename = 'tei_document.xml';
				res.writeHead(200, {
					'Content-Disposition': 'attachment; filename=' + filename,
				});
				res.write(doc);
				res.end();
			}
		}
	)
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
					console.log("File uploaded")
					window.alert("File uploaded.");
				}
		});
	} else {
		res.render('add', { title: 'The Colenso Project', uploaded: false});
	}
});

/** - - - - EDIT - - - - */
router.post('/edit', function(req, res){
	
});
