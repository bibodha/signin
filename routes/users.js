var express = require('express');
var router = express.Router();

router.get('/userlist', function(req, res){
	var db = req.db;
	db.collection('userlist').find().toArray(function(err, items){
		res.json(items);
	});
});

router.post('/adduser', function(req, res){
	var db = req.db;
	db.collection('userlist').insert(req.body, function(err, result){
		res.send(
			(err === null) ? {msg: ''} : {msg: err}
		);
	});
});

router.delete('/deleteuser/:id', function(req, res){
	var db = req.db;
	var userToDelete = req.params.id;
	db.collection('userlist').removeById(userToDelete, function(err, result){
		res.send((result === 1) ? {msg: ''} : {msg: 'error: ' + err});
	});
});

router.post('/getuser/:id', function(req, res){
	var db = req.db,
		userToFetch = req.params.id,
		user = '';

	db.collection('userlist').findById(userToFetch, function(err, result){
		res.send((err === null) ? {err : null, msg: result} : {err : 1, msg: 'error: ' + err});
	});
});

router.post('/signin/:name', function(req, res){
	var db = req.db,
	date = new Date,
	name = req.params.name,
	user;

	db.collection('userlist').findOne({username: name}, function(err, result){
		user = result;
		db.collection('signin').insert({id: user._id, signinTime: date.toLocaleString()}, function(err, result){
			if(err){
				res.send('There was an error: ' + err);
			}
			else{
				res.location("");
				res.redirect("/");
				res.send({msg: ''});
			}
		});
	});
});

module.exports = router;
